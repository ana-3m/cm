import { getGreenSquares } from './detetor.js';

let numCirc; //Variavel com o numero do círculo a ser desenhado
let mudar;
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


canvas.addEventListener("touchstart",(event) => { 
    if (calculateDistance(event.touches[0].clientX, event.touches[0].clientY, greenSquares[numCirc].x, greenSquares[numCirc].y) < greenSquares[numCirc].radius) {
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
    console.log(greenSquares);
    ctx.drawImage(drumSet, 0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "red";
    // Desenhar os círculos vermelhos a crescer

    //let random = await getRandomInt(0, greenSquares.length - 1);
    if(mudar) {
        numCirc = await getRandomInt(0, greenSquares.length - 1);
        console.log("I am inside the click function", numCirc);
        mudar = false;
    }
    console.log(numCirc);
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
    gameLoop();
}, 500);