import { getGreenSquares } from './detetor.js';

let numCirc; //Variavel com o numero do círculo a ser desenhado
let mudar;
const drumSet = new Image();
drumSet.src = "img/drumSetDisplay1.png";

const canvas = document.getElementById("gameCanvas");
canvas.classList.add("hidden");
const ctx = canvas.getContext("2d");



function resizeCanvas() {
    const aspectRatio = drumSet.width / drumSet.height;


    // If the height exceeds the window height, adjust the width instead

    canvas.height = window.innerHeight;
    canvas.width = canvas.height * aspectRatio;
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", function () {
    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 0);
});
resizeCanvas();


canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (calculateDistance(mouseX, mouseY, greenSquares[numCirc].x, greenSquares[numCirc].y) < greenSquares[numCirc].radius) {
        console.log("Clicked on circle", numCirc);
        mudar = true;
    }
    update();
});

let greenSquares = []; //Array para guardar a loc dos quadrados verdes
const maxRadius = 25; // Raio máximo dos círculos
const growthRate = 0.75; // Taxa de crescimento dos círculos

async function initializeGreenSquares() {
    greenSquares = getGreenSquares().map(square => ({ ...square, radius: 0 }));
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
    ctx.drawImage(drumSet, 0, 0, innerWidth, innerHeight);

    ctx.fillStyle = "red";
    // Desenhar os círculos vermelhos a crescer

    //let random = await getRandomInt(0, greenSquares.length - 1);
    if (mudar) {
        numCirc = await getRandomInt(0, greenSquares.length - 1);
        console.log("I am inside the click function", numCirc);
        greenSquares[numCirc].radius = 0; // Reiniciar o raio do círculo
        mudar = false;
    }
    console.log(numCirc);
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



// Initialize green squares after a short delay to ensure detection is complete
setTimeout(() => {
    initializeGreenSquares();
    canvas.classList.remove("hidden");
    gameLoop();
}, 500);