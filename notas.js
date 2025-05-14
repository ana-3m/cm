
import { getGreenSquares } from './detetor.js';
import { animateVareta, resetVareta } from './erros.js';
import { getMessagesById, showMessageByIndex } from './js/messages.js';
import { messages } from './js/messages.js';
import { drawBlurryScreen, resetBlurryScreen } from './newerro.js';
import { drawPulsingBlur, resetPulsingBlur } from './newerro2.js';
import { tryPlayMusic, setVolumeFromRadius, cancelFadeOut, fadeOutMusicAfterDelay, resetMusic } from './music.js';

const sentenceTrigger = 3;
const errorTrigger = 6;
let consecutiveHits = 0;
let consecutiveMisses = 0;

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
let mainRoom = false;
let fadeTimeout = null;
let fadeInterval = null;





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
const growthRate = 1;

async function initializeGreenSquares() {
    if (greenSquares.length <= 8) {
        greenSquares = getGreenSquares().map(square => ({
            x: square.x * (canvas.width / window.innerWidth),
            y: square.y * (canvas.height / window.innerHeight),
            radius: 0
        }));
    }
    numCirc = await getRandomInt(0, greenSquares.length - 1);
}

let step;

function update(index) {
    if (greenSquares.length > 0 && greenSquares[numCirc].radius < maxRadius) {
        step = 0;
        greenSquares[numCirc].radius += growthRate;

    } else {
        switch (step) {
            case 0:
                // Count as a miss
                consecutiveMisses++;
                consecutiveHits = 0;
                fadeOutMusicAfterDelay();
                maxRadiusReached++;

                if (mainRoom) updateBackgroundColor();
                step++;
                mudarIndexMessage = true;
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
    const clamped = Math.min(Math.max(maxRadiusReached, 0), 6); // Clamp from 0 to 6
    const t = map(maxRadiusReached, 0, errorTrigger, 0, 1);
    const lerpedColor = lerpColor(startColor, endColor, t);
    document.body.style.backgroundColor = lerpedColor;
}

async function draw() {
    ctx.filter = "drop-shadow(0px -3px 0px rgba(29, 29, 29, 0.3))";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(drumSet, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    switchBubble = false;

    if (mudar) {
        numCirc = await getRandomInt(0, greenSquares.length - 1);
        greenSquares[numCirc].radius = 0;
        mudar = false;
    }

    ctx.filter = "none";
    if (greenSquares.length > 0 && greenSquares[numCirc]) {
        ctx.beginPath();
        ctx.arc(greenSquares[numCirc].x, greenSquares[numCirc].y, greenSquares[numCirc].radius, 0, Math.PI * 2);
        ctx.fill();
        // Update volume based on radius
        setVolumeFromRadius(greenSquares[numCirc].radius, maxRadius);
    } else {
        numCirc = await getRandomInt(0, greenSquares.length - 1);
        return;
    }


    if (maxRadiusReached % sentenceTrigger === 0 && maxRadiusReached > 0) {
        if (mudarIndexMessage) {
            const reprimendMessages = getMessagesById("Encouragement");
            console.log("Im in");
            if (reprimendMessages.length > 0) {
                const randomIndex = Math.floor(Math.random() * reprimendMessages.length);
                messageIndex = messages.indexOf(reprimendMessages[randomIndex]);
            }
            mudarIndexMessage = await false;
            return;
        }
        showMessageByIndex(messageIndex);
    }
    if (maxRadiusReached % errorTrigger === 0 && maxRadiusReached > 0 && mainRoom) {
        triggerErroAnimation();
        maxRadiusReached = 0;
        mudarIndexMessage = true;
    }
    if (consecutiveMisses > 10) {
        sendUserBackToIntro();
        return; // Exit early to prevent more drawing
    }
    setTimeout(() => update(numCirc), 500); // ✅ this delays update properly



    return;
}

canvas.addEventListener("click", (event) => {
    // MUSIC CONTROL
    tryPlayMusic();              // Start music if not started
    cancelFadeOut();             // Cancel any pending fade

    if (!greenSquares[numCirc]) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const hit = calculateDistance(mouseX, mouseY, greenSquares[numCirc].x, greenSquares[numCirc].y) < greenSquares[numCirc].radius;

    if (hit && greenSquares[numCirc].radius < maxRadius) {
        if (fadeTimeout) {
            clearTimeout(fadeTimeout);
            fadeTimeout = null;
        }
        if (fadeInterval) {
            clearInterval(fadeInterval);
            fadeInterval = null;
        }
        tryPlayMusic();

        // Increase volume smoothly up to 1.0
        if (jazzAudio.volume < 1.0) {
            jazzAudio.volume = Math.min(1.0, jazzAudio.volume + 0.05);
        }

        if (maxRadiusReached >= 1 && !switchBubble) {
            maxRadiusReached--;
        }

        if (consecutiveHits >= 6) {
            resetErrors();
            consecutiveHits = 0;
        }
        mudar = true;
        consecutiveHits++;
        consecutiveMisses = 0;

        // Increase volume smoothly up to 1.0
        if (jazzAudio.volume < 1.0) {
            jazzAudio.volume = Math.min(1.0, jazzAudio.volume + 0.05);
        }

        if (maxRadiusReached >= 1 && !switchBubble) {
            maxRadiusReached--;
        }

        if (consecutiveHits >= 6) {
            resetErrors();
            consecutiveHits = 0;
        }

    } else if (hit && greenSquares[numCirc].radius >= maxRadius) {
        mudar = true;
    }
});



function resetErrors() {
    // Reset background color
    document.body.style.backgroundColor = `rgb(${startColor.r}, ${startColor.g}, ${startColor.b})`;

    // Hide error canvas
    const erroCanvas = document.getElementById("erro");
    erroCanvas.classList.add("hidden");

    // Reset each animation’s internal state
    resetVareta();
    resetBlurryScreen();
    resetPulsingBlur();

    // Reset game error count
    maxRadiusReached = 0;
}


function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

async function getRandomInt(min, max) {
    let random = await Math.round(Math.random() * (max - min) + min);
    return random;
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function triggerErroAnimation() {
    const erroCanvas = document.getElementById("erro");
    erroCanvas.classList.remove("hidden");

    const randomIndex = Math.floor(Math.random() * 3); // Get a random number between 0 and 2
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

function sendUserBackToIntro() {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("intro").classList.remove("hidden");

    maxRadiusReached = 0;
    consecutiveHits = 0;
    consecutiveMisses = 0;

    document.body.style.backgroundColor = `rgb(${startColor.r}, ${startColor.g}, ${startColor.b})`;
    // Reset animations and music
    resetErrors();
    resetMusic();
    resetBlurryScreen();
    resetPulsingBlur();
    resetVareta();
}


setTimeout(() => {
    initializeGreenSquares();
    canvas.classList.remove("hidden");
    gameLoop();
}, 500);