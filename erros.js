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
    y: 0,
    angle: 0,
    speedY: 3,
    rotationSpeed: 3
};

let flickerTimeout;
let flickerIntensity = 0; // 0-1 how bad the damage is

export function animateVareta(animationStopped) {

    erro.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!animationStopped) {
        vareta.y += vareta.speedY;
        vareta.angle += vareta.rotationSpeed;
        if (vareta.x > canvas.width * 0.15) {
            vareta.x -= vareta.speedY; // Move left
        }
        erro.save();
        erro.translate(vareta.x, vareta.y);
        erro.rotate((vareta.angle * Math.PI) / 180);
        erro.drawImage(varetaImg, -varetaImg.width / 4, -varetaImg.height / 4);
        erro.restore();
        if (vareta.y >= canvas.height) {
            animationStopped = true;
            flickerIntensity = 0.3;
            vareta = {
                x: canvas.width / 2,
                y: 0,
                angle: 0,
                speedY: 3,
                rotationSpeed: 3
            }; // Reset nas variaveis
            scheduleFlicker();
        }
        requestAnimationFrame(animateVareta);
        console.log("Animation running", vareta.x, vareta.y, vareta.angle);
    } else {
        drawBrokenScreen();
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

// Start animation when images load
varetaImg.onload = () => {
    brokenScreenImg.onload = () => {
        animateVareta();
    };
};

// Clean up on exit
window.addEventListener('beforeunload', () => {
    clearTimeout(flickerTimeout);
});