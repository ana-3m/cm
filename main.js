
import { getGreenSquares } from './detetor.js';
import { getMessagesById, showMessageByIndex, messages } from './js/messages.js';
import { animateVareta, resetVareta } from './erros.js';
import { drawBlurryScreen, resetBlurryScreen } from './newerro.js';
import { drawPulsingBlur, resetPulsingBlur } from './newerro2.js';
import { tryPlayMusic, setVolumeFromRadius, cancelFadeOut, fadeOutMusicAfterDelay, resetMusic } from './music.js';
import { drawIntro } from './intro.js';
import { showFletcherPhrase } from "./fletcher.js";


const invitationHitsMax = 10; //Trigger para ser convidado a tocar na sala principal
const sentenceTrigger = 3; //Trigger para mostrar mensagens a reclamar
const errorTrigger = 6; //Trigger para mostrar os erros

let consecutiveHits = 0;
let consecutiveMisses = 0;
let invitationMode = false;
let invitationHits = 0;
let numCirc;
let mudar = false;
const drumSet = new Image();
let maxRadiusReached = 0;
let mudarIndexMessage = true;
let messageIndex = null;
const canvas = document.getElementById("gameCanvas");
canvas.classList.add("hidden");
const ctx = canvas.getContext("2d");
let switchBubble = false;
let randomIndex = null;
let mainRoom = false;
let trocaErro = true;
let animationFrameId = null;
let fletcherIndex = 0;

export let countdownFinished = false;
export function markCountdownFinished() {
    countdownFinished = true;
}

function resizeCanvas() {
    const aspectRatio = drumSet.width / drumSet.height;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvas.height > window.innerHeight) {
        canvas.height = window.innerHeight;
        canvas.width = canvas.height * aspectRatio;
    }
}

export async function setDrumImage(src) {
    drumSet.src = src;
    console.log(src);
    if (src == 'img/drumSetDisplay1.png') { mainRoom = await true; }
    drumSet.onload = () => {
        resizeCanvas();
        initializeGreenSquares();
    };
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

export function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

let greenSquares = [];
const maxRadius = 75;
const growthRate = 0.6;

async function initializeGreenSquares() {
    greenSquares = [];
    greenSquares = getGreenSquares().map(square => ({
        x: square.x * (canvas.width / window.innerWidth),
        y: square.y * (canvas.height / window.innerHeight),
        radius: 0
    }));
    numCirc = await getRandomInt(0, greenSquares.length - 1);
}

let step;

function update(index) {
    if (greenSquares.length > 0 && greenSquares[numCirc].radius < maxRadius) {
        step = 0;
        greenSquares[numCirc].radius += invitationMode ? 0.25 : growthRate;
    } else {
        switch (step) {
            case 0:
                // Count as a miss
                consecutiveMisses++;
                consecutiveHits = 0;
                fadeOutMusicAfterDelay();
                maxRadiusReached++;
                step++;
                mudarIndexMessage = true;
                if (invitationMode) {
                    invitationHits = 0;
                }
                break;

            case 1:
                switchBubble = true;
                break;
        }
    }
}


function lerpColor(color1, color2, t) {
    const r = Math.round(lerp(color1.r, color2.r, t));
    const g = Math.round(lerp(color1.g, color2.g, t));
    const b = Math.round(lerp(color1.b, color2.b, t));
    return `rgb(${r}, ${g}, ${b})`;
}

const startColor = { r: 97, g: 50, b: 19 };
const endColor = { r: 29, g: 28, b: 27 };

function updateBackgroundColor() {

    const t = map(maxRadiusReached, 0, errorTrigger, 0, 1);
    const lerpedColor = lerpColor(startColor, endColor, t);
    document.body.style.backgroundColor = lerpedColor;
}


async function draw() {
    ctx.filter = "drop-shadow(0px -3px 0px rgba(29, 29, 29, 0.3))";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(drumSet, 0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.fillStyle = "red";
    //if (!countdownFinished && !invitationMode) return;
    switchBubble = false;
    if (mudar) {
        numCirc = await getRandomInt(0, greenSquares.length - 1);

        greenSquares[numCirc].radius = 0;
        mudar = false;
    }

    ctx.filter = "none";
    if (greenSquares.length > 0 && greenSquares[numCirc] && (invitationMode || countdownFinished)) {
        ctx.beginPath();
        ctx.arc(greenSquares[numCirc].x, greenSquares[numCirc].y, greenSquares[numCirc].radius, 0, Math.PI * 2);
        ctx.fill();

        // Update volume based on radius
        setVolumeFromRadius(greenSquares[numCirc].radius, maxRadius);
    } else {
        numCirc = await getRandomInt(0, greenSquares.length - 1);
        return;
    }

    if (mainRoom) {
        if (maxRadiusReached % errorTrigger === 0 && maxRadiusReached > 0) {
            triggerErroAnimation();
            console.log("Error triggered");
        }
        updateBackgroundColor();
        if (maxRadiusReached % sentenceTrigger === 0 && maxRadiusReached > 0) {
            if (mudarIndexMessage) {
                let reprimendMessages = getMessagesById("Encouragement");
                if (reprimendMessages.length > 0 && countdownFinished) {
                    const randomIndex = Math.floor(Math.random() * reprimendMessages.length);
                    messageIndex = messages.indexOf(reprimendMessages[randomIndex]);
                    showMessageByIndex(messageIndex);
                    console.log("Message index:", messageIndex);
                }
                mudarIndexMessage = await false;
            }
        }

        if (consecutiveMisses > 8) {
            document.getElementById("frontDoor").classList.add("locked");
            showFletcherPhrase("expelled");
            fletcherIndex = 1;
            sendUserBackToIntro();
            return; // Exit early to prevent more drawing
        }
    }

    setTimeout(() => update(numCirc), 1000);
    return;
}

canvas.addEventListener("click", (event) => {
    // MUSIC CONTROL
    //tryPlayMusic();
    cancelFadeOut();

    if (!greenSquares[numCirc]) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const hit = calculateDistance(mouseX, mouseY, greenSquares[numCirc].x, greenSquares[numCirc].y) < greenSquares[numCirc].radius;

    if (hit && greenSquares[numCirc].radius < maxRadius) {
        if (invitationMode) {
            invitationHits++;
            if (invitationHits >= invitationHitsMax) {
                if (document.getElementById("frontDoor").classList.contains("locked")) {
                    window.frontDoorUnlocked = true;
                    const frontDoor = document.getElementById("frontDoor");
                    frontDoor.classList.remove("locked");
                    frontDoor.style.cursor = "pointer";
                }
                showFletcherPhrase("encoraje");
                const invitationMessages = getMessagesById("Invitation");
                const doorIcon = document.getElementById("doorIcon");
                if (doorIcon && !doorIcon.classList.contains("blink-door")) {
                    doorIcon.classList.add("blink-door");
                }
                if (invitationMessages.length > 0) {
                    const randomIndex = Math.floor(Math.random() * invitationMessages.length);
                    const index = messages.indexOf(invitationMessages[randomIndex]);
                    showMessageByIndex(index);
                }
                invitationHits = 0; // reset after displaying
            }
        }

        if (consecutiveHits >= 6) {
            resetErrors();
            trocaErro = true;
            consecutiveHits = 0;
        }
        mudar = true;
        consecutiveHits++;
        consecutiveMisses = 0;

        if (maxRadiusReached >= 1 && !switchBubble) {
            maxRadiusReached--;
        }

    } else if (hit && greenSquares[numCirc].radius >= maxRadius) {
        mudar = true;
    }
});


function resetErrors() {
    // Reset background color
    //document.body.style.backgroundColor = `rgb(${startColor.r}, ${startColor.g}, ${startColor.b})`;

    // Hide error canvas
    const erroCanvas = document.getElementById("erro");
    erroCanvas.classList.add("hidden");

    // Reset each animation’s internal state
    resetVareta();
    resetBlurryScreen();
    resetPulsingBlur();

    trocaErro = true;

    // Reset game error count
    maxRadiusReached = 0;
}

export function fletcherPhraseIndex() {
    return fletcherIndex;
}

function gameLoop() {
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}


async function getRandomInt(min, max) {
    let random = await Math.round(Math.random() * (max - min) + min);
    return random;
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

async function triggerErroAnimation() {
    const erroCanvas = document.getElementById("erro");
    erroCanvas.classList.remove("hidden");
    if (trocaErro) {
        randomIndex = Math.floor(Math.random() * 3); // Get a random number between 0 and 2
        trocaErro = await false;
    }
    console.log("Random index:", randomIndex);
    switch (randomIndex) {
        case 0:
            animateVareta();
            break;
        case 1:
            drawBlurryScreen();
            break;
        case 2:
            drawPulsingBlur();
            break;
    }
}

export function sendUserBackToIntro() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("intro").classList.remove("hidden");
    document.getElementById("doorIcon").classList.add("hidden");

    if (document.getElementById("doorIcon").classList.contains("blink-door")) {
        document.getElementById("doorIcon").classList.remove("blink-door");
    }
    const bottomBar = document.getElementById("bottomBar");
    if (!bottomBar.classList.contains("hidden")) {
        bottomBar.classList.add("hidden");
    }

    greenSquares = [];
    countdownFinished = false;
    maxRadiusReached = 0;
    consecutiveHits = 0;
    consecutiveMisses = 0;
    trocaErro = true;
    mainRoom = false;
    invitationMode = false;
    document.body.style.backgroundColor = `rgb(${startColor.r}, ${startColor.g}, ${startColor.b})`;

    // Reset animations and music
    resetErrors();
    resetMusic();
    resetBlurryScreen();
    resetPulsingBlur();
    resetVareta();
    drawIntro();

    document.getElementById("musicSelection").classList.add("hidden");
    document.querySelectorAll("#musicSelection button").forEach(btn => btn.disabled = false);

    tryPlayMusic("./sound/FletcherClass.wav");
}

export function setInvitationMode(enabled) {
    invitationMode = enabled;
}

export { initializeGreenSquares, gameLoop };

setTimeout(() => {
    initializeGreenSquares();
    canvas.classList.remove("hidden");
    gameLoop();
}, 500);