const canvas = document.getElementById("erro");
const erro = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const varetaImg = new Image();
varetaImg.src = "img/vareta.png";
const brokenScreenImg = new Image();
brokenScreenImg.src = "img/brokenScreen.png";

// Vareta properties
let vareta = {
    x: canvas.width / 2,
    y: -200,
    angle: 0,
    speedY: 10,
    rotationSpeed: 3
};

let flickerTimeout;
let flickerIntensity = 0; // 0-1 how bad the damage is
let animationStopped = false; // Flag to stop the animation
export async function animateVareta() {
    erro.clearRect(0, 0, canvas.width, canvas.height);
    // Update vareta's position and angle
    vareta.y += vareta.speedY;
    vareta.angle += vareta.rotationSpeed * (Math.PI / 180); // Convert degrees to radians

    // Move vareta left if it hasn't reached the target x position
    if (vareta.x > canvas.width * 0.10) {
        vareta.x -= vareta.speedY;
    }

    // Apply transformations and draw the vareta
    erro.save();
    erro.translate(vareta.x, vareta.y); // Move to the vareta's position
    erro.rotate(vareta.angle); // Rotate the canvas
    erro.drawImage(varetaImg, varetaImg.width, varetaImg.height); // Draw centered
    erro.restore();

    // Check if vareta has moved off-screen
    if (vareta.y >= canvas.height) {
        animationStopped = await true;
        console.log("Animation stopped", animationStopped);
        flickerIntensity = 0.3; // Start flickering effect

    }
    if (!animationStopped) {
        // Continue the animation loop
        requestAnimationFrame(() => animateVareta(false));
    } else {
        requestAnimationFrame(() => drawBrokenScreen());
    }
}



function scheduleFlicker() {
    // Random interval (50-300ms) for more natural effect
    const delay = 50 + Math.random() * 250;

    // Gradually increase damage up to 0.8 (never fully 1.0)
    flickerIntensity = Math.min(0.8, flickerIntensity + 0.01);

    flickerTimeout = setTimeout(() => {
        applyScreenDamage();
        scheduleFlicker();
    }, delay);
}



function applyScreenDamage() {
    // Occasionally do a longer blackout (1-3 frames)
    if (Math.random() < 0.1 * flickerIntensity) {
        for (let i = 0; i < 1 + Math.floor(Math.random() * 3); i++) {
            setTimeout(() => {
                erro.clearRect(0, 0, canvas.width, canvas.height);
            }, i * 50);
        }
        return;
    }
}

function drawBrokenScreen() {
    // Base broken screen
    erro.drawImage(brokenScreenImg, 0, 0, canvas.width, canvas.height);

}

// Clean up on exit
window.addEventListener('beforeunload', () => {
    clearTimeout(flickerTimeout);
});