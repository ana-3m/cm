const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
    speedY: 5,
    rotationSpeed: 5
};

let animationStopped = false;
let flickerTimeout;
let lastFlickerTime = 0;
let flickerIntensity = 0; // 0-1 how bad the damage is

function animateVareta() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!animationStopped) {
        vareta.y += vareta.speedY;
        vareta.angle += vareta.rotationSpeed;

        ctx.save();
        ctx.translate(vareta.x, vareta.y);
        ctx.rotate((vareta.angle * Math.PI) / 180);
        ctx.drawImage(varetaImg, -varetaImg.width / 4, -varetaImg.height / 4);
        ctx.restore();

        if (vareta.y >= canvas.height) {
            animationStopped = true;
            flickerIntensity = 0.3; // Initial damage
            scheduleFlicker();
        }
        
        requestAnimationFrame(animateVareta);
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
    const now = Date.now();
    
    // Occasionally do a longer blackout (1-3 frames)
    if (Math.random() < 0.1 * flickerIntensity) {
        for (let i = 0; i < 1 + Math.floor(Math.random() * 3); i++) {
            setTimeout(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, i * 50);
        }
        return;
    }
    
    // Choose random damage type based on intensity
    const damageType = Math.random();
    
    if (damageType < 0.3 * flickerIntensity) {
        // Full screen flicker
        ctx.globalAlpha = 0.7 + Math.random() * 0.3;
        drawBrokenScreen();
        ctx.globalAlpha = 1.0;
    } 
    else if (damageType < 0.6 * flickerIntensity) {
        // Horizontal split flicker
        const splitY = canvas.height * Math.random();
        ctx.drawImage(brokenScreenImg, 
            0, 0, canvas.width, splitY,
            0, 0, canvas.width, splitY);
    }
    else if (damageType < 0.8 * flickerIntensity) {
        // Vertical split flicker
        const splitX = canvas.width * Math.random();
        ctx.drawImage(brokenScreenImg, 
            0, 0, splitX, canvas.height,
            0, 0, splitX, canvas.height);
    }
    else {
        // Random block corruption
        const blockSize = 50 + Math.random() * 150;
        const x = Math.random() * (canvas.width - blockSize);
        const y = Math.random() * (canvas.height - blockSize);
        
        // Sometimes add color distortion
        if (Math.random() < 0.4) {
            ctx.save();
            ctx.filter = `hue-rotate(${Math.random() * 360}deg) brightness(${0.7 + Math.random() * 0.6})`;
            ctx.drawImage(brokenScreenImg, 
                x, y, blockSize, blockSize,
                x, y, blockSize, blockSize);
            ctx.restore();
        } else {
            ctx.clearRect(x, y, blockSize, blockSize);
        }
    }
}

function drawBrokenScreen() {
    // Base broken screen
    ctx.drawImage(brokenScreenImg, 0, 0, canvas.width, canvas.height);
    
    // Add scan lines
    if (Math.random() < 0.7) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let y = 0; y < canvas.height; y += 3) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    // Add random noise
    if (Math.random() < flickerIntensity) {
        const noiseDensity = flickerIntensity * 0.2;
        for (let i = 0; i < canvas.width * canvas.height * noiseDensity; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 3;
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, ${Math.random() * 100}%)`;
            ctx.fillRect(x, y, size, size);
        }
    }
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