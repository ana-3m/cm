const canvas = document.getElementById("gameDetetor");
const ctx = canvas.getContext("2d");
const drumImg = new Image();
drumImg.src = "img/detetorGrande1.png";

let greenSquares = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

drumImg.onload = () => {
    ctx.drawImage(drumImg, 0, 0, canvas.width, canvas.height);
    detectGreen();

    canvas.style.display = "none"; 
};

function detectGreen() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Detect green squares
        if (g > 200 && r < 100 && b < 100) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
            greenSquares.push({ x, y });
        }
    }
    console.log("Detected:", greenSquares, "green squares.");
}

// Export the green squares
export function getGreenSquares() {
    return greenSquares;
}

