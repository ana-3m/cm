const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the "vareta" image
const varetaImg = new Image();
varetaImg.src = "img/vareta.png";

// Load the "broken screen" image
const brokenScreenImg = new Image();
brokenScreenImg.src = "img/brokenScreen.png";

// Initial position, rotation, and speed
let vareta = {
    x: canvas.width / 2, // Start in the middle of the screen
    y: 0,                // Start at the top of the screen
    angle: 0,            // Initial rotation angle
    speedY: 5,           // Vertical speed
    rotationSpeed: 5     // Rotation speed (degrees per frame)
};

let animationStopped = false; // Flag to check if the animation has stopped

// Animate the "vareta"
function animateVareta() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    if (!animationStopped) {
        // Update position and rotation
        vareta.y += vareta.speedY; // Move down
        vareta.angle += vareta.rotationSpeed; // Rotate

        // Draw the "vareta" image
        ctx.save(); // Save the current canvas state
        ctx.translate(vareta.x, vareta.y); // Move the canvas origin to the "vareta" position
        ctx.rotate((vareta.angle * Math.PI) / 180); // Rotate the canvas
        ctx.drawImage(varetaImg, -varetaImg.width / 4, -varetaImg.height / 4); // Draw the image centered
        ctx.restore(); // Restore the canvas state

        // Stop the animation when the "vareta" leaves the screen
        if (vareta.y >= canvas.height) {
            console.log("Vareta animation stopped.");
            animationStopped = true; // Set the flag to stop the animation
        } else {
            requestAnimationFrame(animateVareta); // Continue the animation
        }
    } else {
        // Display the "broken screen" image
        console.log("Drawing broken screen image.");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(brokenScreenImg, 0, 0, canvas.width, canvas.height); // Draw the broken screen image
    }
}

// Start the animation when both images are loaded
varetaImg.onload = () => {
    brokenScreenImg.onload = () => {
        animateVareta();
    };
};