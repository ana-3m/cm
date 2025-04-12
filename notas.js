import { getGreenSquares } from './detetor.js';

const drumSet = new Image();
drumSet.src = "img/drumSetDisplay.png";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


let greenSquares = []; //Array para guardar a loc dos quadrados verdes
const maxRadius = 40; // Raio máximo dos círculos
const growthRate = 0.75; // Taxa de crescimento dos círculos

function initializeGreenSquares() {
    greenSquares = getGreenSquares().map(square => ({ ...square, radius: 0 }));
}

function update() {
    greenSquares.forEach(square => {
        if (square.radius < maxRadius) {
            square.radius += growthRate;
        }
    });
}

function draw() {
    ctx.drawImage(drumSet, 0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "red";
    // Desenhar os círculos verdes a crescer
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