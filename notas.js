import { getGreenSquares } from './detetor.js';
import { animateVareta } from './erros.js';
import { getMessagesById, showMessageByIndex } from './js/messages.js';
import { messages } from './js/messages.js';

const sentenceTrigger = 3;
const errorTrigger = 6;

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

function map(value, inMin, inMax, outMin, outMax) {
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
    if (greenSquares.length > 0 && greenSquares[index].radius < maxRadius ) {
        step = 0;
        greenSquares[index].radius += growthRate;
    } else {
        switch (step) {
            case 0:
                maxRadiusReached++;
                if (mainRoom) {
                    updateBackgroundColor();
                }
                step++;
                console.log("step 0");
                console.log("max radius", maxRadiusReached);
                mudarIndexMessage = true;
                break;
            case 1: ; switchBubble = true; break;
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
    ctx.beginPath();
    if(greenSquares.length > 0){
    ctx.arc(greenSquares[numCirc].x, greenSquares[numCirc].y, greenSquares[numCirc].radius, 0, Math.PI * 2);
    }
    ctx.fill();

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
    setTimeout(update(numCirc), 500);
    console.log();
    return;
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (calculateDistance(mouseX, mouseY, greenSquares[numCirc].x, greenSquares[numCirc].y) < greenSquares[numCirc].radius) {
        mudar = true;
        if (maxRadiusReached >= 1 && !switchBubble) {
            maxRadiusReached--;
        }
    }
});

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
    animateVareta();
}

setTimeout(() => {
    initializeGreenSquares();
    canvas.classList.remove("hidden");
    gameLoop();
}, 500);