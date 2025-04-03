import { getGreenSquares } from './detetor.js';
import { drumImgWifi } from './detetor.js';

const drumSet = drumImgWifi();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// Wait for green squares to be detected
let greenSquares = [];
const maxRadius = 30; // Maximum radius for the circles
const growthRate = 0.5; // Rate at which the radius grows

function initializeGreenSquares() {
    greenSquares = getGreenSquares().map(square => ({ ...square, radius: 0 }));
}

function update() {
    // Grow the radius of each circle until it reaches maxRadius
    greenSquares.forEach(square => {
        if (square.radius < maxRadius) {
            square.radius += growthRate;
        }
    });
}

function draw() {
    ctx.drawImage(drumSet, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    // Draw growing circles
    greenSquares.forEach(square => {
        ctx.beginPath();
        ctx.arc(square.x, square.y, square.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize green squares after a short delay to ensure detection is complete
setTimeout(() => {
    initializeGreenSquares();
    gameLoop();
}, 500);