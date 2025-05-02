import { getGreenSquares } from './detetor.js';
import { animateVareta } from './erros.js';
import { showNextMessage, getMessagesById, showMessageByIndex } from './js/messages.js';

let numCirc;
let mudar = false;
const drumSet = new Image();
drumSet.src = "img/drumSetDisplay1.png";
let lastMessageTime = 0;

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

let lastInteractionTime = Date.now();
let missedClicks = 0;

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

const maxMissedClicks = 25;

function checkInactivity() {
    const currentTime = Date.now();
    const timeDiff = (currentTime - lastInteractionTime);

    const lerpFactor = map(missedClicks, 0, maxMissedClicks, 0, 1);

    if (timeDiff > 2000) {
        triggerErroAnimation();
        const reprimendMessages = getMessagesById("Reprimend");
        if (reprimendMessages.length > 0) {
            const randomIndex = Math.floor(Math.random() * reprimendMessages.length);
            const messageIndex = messages.indexOf(reprimendMessages[randomIndex]);
            showMessageByIndex(messageIndex);
        }
    }

    const red = Math.round(lerp(97, 30, lerpFactor));
    const green = Math.round(lerp(50, 30, lerpFactor));
    const blue = Math.round(lerp(19, 30, lerpFactor));
    document.body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

    setTimeout(checkInactivity, 100);
}

function resetInactivityTimer() {
    lastInteractionTime = Date.now();
    if (missedClicks > 1) {
        missedClicks--;
        const encouragementMessages = getMessagesById("Encouragement");
        if (encouragementMessages.length > 0) {
            const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
            const messageIndex = messages.indexOf(encouragementMessages[randomIndex]);
            showMessageByIndex(messageIndex);
        }
    }
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
        showNextMessage();
        lastMessageTime = now;
        triggerErroAnimation();
    }

    update();
});

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

function update() {
    greenSquares.forEach(square => {
        if (square.radius < maxRadius) {
            square.radius += growthRate;
        }
    });
}

async function draw() {
    ctx.filter = "drop-shadow( 0px -3px 0px rgba(29, 29, 29, 0.28))";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(drumSet, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";

    if (mudar) {
        numCirc = await getRandomInt(0, greenSquares.length - 1);
        greenSquares[numCirc].radius = 0;
        mudar = false;
    }
    ctx.filter = "none";
    ctx.beginPath();
    ctx.arc(greenSquares[numCirc].x, greenSquares[numCirc].y, greenSquares[numCirc].radius, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop() {
    update();
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