import { getGreenSquares } from './detetor.js';
import { animateVareta } from './erros.js';
import { getMessagesById, showMessageByIndex } from './js/messages.js';
import { messages } from './js/messages.js';

const maxRadiusReachedThreshold = 3;

let numCirc;
let mudar = false;
const drumSet = new Image();
drumSet.src = "img/drumSetDisplay1.png";
let lastMessageTime = 0;
let maxRadiusReached = 0;
let mudarIndexMessage = true;
let messageIndex = null;
const canvas = document.getElementById("gameCanvas");
canvas.classList.add("hidden");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const aspectRatio = drumSet.width / drumSet.height;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvas.height > window.innerHeight) {
        canvas.height = window.innerHeight;
        canvas.width = canvas.height * aspectRatio;
    }
}

drumSet.onload = () => {
    resizeCanvas();
    initializeGreenSquares();
};

let lastInteractionTime;
let missedClicks = 0;

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function resetInactivityTimer() {
    lastInteractionTime = Date.now();
    if (missedClicks > 1) {
        missedClicks--;
    }
}

let greenSquares = [];
const maxRadius = 100;
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
    if (greenSquares[index].radius < maxRadius) {
        step = 0;
        greenSquares[index].radius += growthRate;
    } else {
        switch (step) {
            case 0:
                maxRadiusReached++; step++; console.log("step 0"); console.log("max radius", maxRadiusReached); mudarIndexMessage = true; break;
            case 1: ; break;
        }
    }
}

async function draw() {
    ctx.filter = "drop-shadow(0px -3px 0px rgba(29, 29, 29, 0.28))";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(drumSet, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";

    if (mudar) {
        numCirc = await getRandomInt(0, greenSquares.length - 1);
        if (maxRadiusReached >= maxRadiusReachedThreshold) {
            maxRadiusReached = 0;
        };
        greenSquares[numCirc].radius = 0;
        mudar = false;
    }

    ctx.filter = "none";
    ctx.beginPath();
    ctx.arc(greenSquares[numCirc].x, greenSquares[numCirc].y, greenSquares[numCirc].radius, 0, Math.PI * 2);
    ctx.fill();

    if (maxRadiusReached >= maxRadiusReachedThreshold) {
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
        resetInactivityTimer();
        if (missedClicks > 1) {
            missedClicks--;
        } 
    }

    const now = Date.now();
    if (now - lastMessageTime > 2000) {
        lastMessageTime = now;
        triggerErroAnimation();
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