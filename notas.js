import { getGreenSquares } from './detetor.js';
import { animateVareta } from './erros.js';
import { showNextMessage } from './js/messages.js';

let numCirc; // Variável com o número do círculo a ser desenhado
let mudar = false; // Variável para controlar a mudança de círculo
const drumSet = new Image();
drumSet.src = "img/drumSetDisplay1.png";
let lastMessageTime = 0; 

const canvas = document.getElementById("gameCanvas");
canvas.classList.add("hidden");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const aspectRatio = drumSet.width / drumSet.height;

    // Set canvas dimensions based on the window size and aspect ratio
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // If the height exceeds the window height, adjust the width instead
    if (canvas.height > window.innerHeight) {
        canvas.height = window.innerHeight;
        canvas.width = canvas.height * aspectRatio;
    }
}

drumSet.onload = () => {
    resizeCanvas(); // Resize the canvas after the image is loaded
    initializeGreenSquares(); // Initialize green squares
    //canvas.classList.remove("hidden"); // Show the canvas
    //gameLoop(); // Start the game loop
};

let lastInteractionTime = Date.now(); // Track the last interaction time
let missedClicks = 0; // Counter for missed interactions

// Function to linearly interpolate between two values
function lerp(start, end, t) {
    return start + (end - start) * t;
}

function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

const maxMissedClicks = 25;


function checkInactivity() {
    const currentTime = Date.now();
    const timeDiff = (currentTime - lastInteractionTime); // Time difference in seconds
    // Map missedClicks to a range between 0 and 1
    const lerpFactor = map(missedClicks, 0, maxMissedClicks, 0, 1); // Adjust the range as needed
    console.log("Diferença de cliques:", timeDiff);
    if (timeDiff > 2000) {
        triggerErroAnimation(); // Call the error animation function
    }

    console.log(timeDiff);

    // Original color: #613213 (RGB: 97, 50, 19)
    // Target color: #1E1E1E (RGB: 30, 30, 30)
    const red = Math.round(lerp(97, 30, lerpFactor));
    const green = Math.round(lerp(50, 30, lerpFactor));
    const blue = Math.round(lerp(19, 30, lerpFactor));
    document.body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    // Check again after 100ms
    setTimeout(checkInactivity, 100);
}

// Reset the inactivity timer on user interaction
function resetInactivityTimer() {
    lastInteractionTime = Date.now(); // Update the last interaction time
}

// Add event listeners for user interaction


// Start checking for inactivity
//checkInactivity();
//lastInteractionTime = Date.now(); // Initialize the last interaction time

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Handle circle click
    if (calculateDistance(mouseX, mouseY, greenSquares[numCirc].x, greenSquares[numCirc].y) < greenSquares[numCirc].radius) {
        mudar = true;
        resetInactivityTimer();
        if (missedClicks > 1) {
            missedClicks--;
        }
    }

    // Handle message display (with cooldown)
    const now = Date.now();
    if (now - lastMessageTime > 2000) {
        showNextMessage();
        lastMessageTime = now;
        triggerErroAnimation();
    }

    update();
});

let greenSquares = []; // Array para guardar a loc dos quadrados verdes
const maxRadius = 100; // Raio máximo dos círculos
const growthRate = 1; // Taxa de crescimento dos círculos

async function initializeGreenSquares() {
    if (greenSquares.length <= 8) {
        greenSquares = getGreenSquares().map(square => ({
            x: square.x * (canvas.width / window.innerWidth), // Scale x-coordinate
            y: square.y * (canvas.height / window.innerHeight), // Scale y-coordinate
            radius: 0 // Initialize radius
        }));
    }
    numCirc = await getRandomInt(0, greenSquares.length - 1);
}

function update() {
    greenSquares.forEach(square => {
        if (square.radius < maxRadius) {
            square.radius += growthRate; // Gradually increase the radius
            
        }


    });

}

async function draw() {
    ctx.filter = "drop-shadow( 0px -3px 0px rgba(29, 29, 29, 0.28))";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(drumSet, 0, 0, canvas.width, canvas.height); // Draw the image to fit the canvas
    ctx.fillStyle = "red";

    if (mudar) {
        numCirc = await getRandomInt(0, greenSquares.length - 1);
        greenSquares[numCirc].radius = 0; // Reiniciar o raio do círculo
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
    erroCanvas.classList.remove("hidden"); // Ensure the canvas is visible
    animateVareta(false); // Call the animation function from erro1.js
}

/*canvas.onclick = ()=> {
    triggerErroAnimation(); // Call the error animation function when the canvas is clicked
}*/

setTimeout(() => {
    initializeGreenSquares();
    canvas.classList.remove("hidden");
    gameLoop();
}, 500);