const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const drumImg = new Image();
drumImg.src = "img/drumSet2.png"; // Make sure this path is correct

let greenSquares = [];

drumImg.onload = () => {
    canvas.width = drumImg.width;
    canvas.height = drumImg.height;
    ctx.drawImage(drumImg, 0, 0);
    detectGreenSquares();
    drawCircles();
};

function detectGreenSquares() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Detect green pixels (adjust threshold as needed)
        if (g > 150 && r < 100 && b < 100) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
            greenSquares.push({ x, y });
        }
    }

    console.log("Detected green squares:", greenSquares);
}

function drawCircles() {
    ctx.fillStyle = "red";
    greenSquares.forEach(square => {
        ctx.beginPath();
        ctx.arc(square.x, square.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Function to get the positions of green squares
function getGreenSquares() {
    return greenSquares;
}

// Export function to be used in other scripts
window.getGreenSquares = getGreenSquares;
document.body.appendChild(canvas); // Append canvas to the body
canvas.style.position = "absolute"; // Position the canvas absolutely