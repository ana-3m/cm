import { getGreenSquares } from './detetor.js';
import { animateVareta } from './erro1.js';


let numCirc; // Variável com o número do círculo a ser desenhado
let mudar;
const drumSet = new Image();
drumSet.src = "img/drumSetDisplay1.png";

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
    console.log("Image loaded:", drumSet.src);
    resizeCanvas(); // Resize the canvas after the image is loaded
    initializeGreenSquares(); // Initialize green squares
    canvas.classList.remove("hidden"); // Show the canvas
    gameLoop(); // Start the game loop
};

let lastInteractionTime = Date.now(); // Track the last interaction time
let missedClicks = 0; // Counter for missed interactions

// Function to linearly interpolate between two values
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Function to gradually change the background color
function checkInactivity() {
    const currentTime = Date.now();
    const timeDiff = (currentTime - lastInteractionTime) / 1000; // Time difference in seconds

    if (timeDiff > 1) {
        missedClicks++; // Increment missed clicks
        console.log(`Missed clicks: ${missedClicks}`);

        // Calculate the gradient toward black
        const gradientFactor = Math.min(missedClicks / 8, 1); // Cap at 1 (fully black)
        const red = Math.round(97 - (97 * gradientFactor)); // Gradually reduce red (97 is #613213's red value)
        const green = Math.round(50 - (50 * gradientFactor)); // Gradually reduce green (50 is #613213's green value)
        const blue = Math.round(19 - (19 * gradientFactor)); // Gradually reduce blue (19 is #613213's blue value)

        document.body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

        // If 8 consecutive missed interactions, set background to black
        if (missedClicks >= 20) {
            triggerErroAnimation(); // Call the error animation function
        }
    } else if (missedClicks > 0) {
        // Gradually decrease missedClicks if the user interacts within the required time
        missedClicks--;
        console.log(`Missed clicks decreasing: ${missedClicks}`);

        // Map missedClicks to a range between 0 and 1
        const lerpFactor = Math.min(missedClicks / 8, 1); // Cap at 1 (fully darkened)

        // Original color: #613213 (RGB: 97, 50, 19)
        // Target color: #1E1E1E (RGB: 30, 30, 30)
        const red = Math.round(lerp(97, 30, lerpFactor));
        const green = Math.round(lerp(50, 30, lerpFactor));
        const blue = Math.round(lerp(19, 30, lerpFactor));
        document.body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    }

    // Check again after 100ms
    setTimeout(checkInactivity, 100);
}

// Reset the inactivity timer on user interaction
function resetInactivityTimer() {
    lastInteractionTime = Date.now(); // Update the last interaction time
}

// Add event listeners for user interaction
canvas.addEventListener("click", resetInactivityTimer);
canvas.addEventListener("mousemove", resetInactivityTimer);
canvas.addEventListener("keydown", resetInactivityTimer);

// Start checking for inactivity
checkInactivity();

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (calculateDistance(mouseX, mouseY, greenSquares[numCirc].x, greenSquares[numCirc].y) < greenSquares[numCirc].radius) {
        console.log("Clicked on circle", numCirc);
        mudar = true;
        lastInteractionTime = new Date().getTime(); // Get the current time in milliseconds
    }
    update();
});

let greenSquares = []; // Array para guardar a loc dos quadrados verdes
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
    ctx.drawImage(drumSet, 0, 0, canvas.width, canvas.height); // Draw the image to fit the canvas

    ctx.fillStyle = "red";

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

function triggerErroAnimation() {
    const erroCanvas = document.getElementById("erro");
    erroCanvas.classList.remove("hidden"); // Ensure the canvas is visible
    animateVareta(); // Call the animation function from erro1.js
}

/*canvas.onclick = ()=> {
    triggerErroAnimation(); // Call the error animation function when the canvas is clicked
}*/

setTimeout(() => {
    initializeGreenSquares();
    canvas.classList.remove("hidden");
    gameLoop();
}, 500);