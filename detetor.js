//Esta função é responsável por detectar os quadados verdes na imagem que nao está visivel
//isto para detetar o centro dos intrumentos e exporta a função getGreenSquares que devolve um array com as posições dos quadrados verdes 

const canvas = document.getElementById("gameDetetor");
const ctx = canvas.getContext("2d");
const drumImg = new Image();

let greenSquares = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export function loadDetectorImage(imageSrc) {
    drumImg.src = imageSrc;

    drumImg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(drumImg, 0, 0, canvas.width, canvas.height);
        detectGreen();
        canvas.style.display = "none";
    };
}

//Deteção dos quadrados verdes
function detectGreen() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        //Deteção de quadrados verdes
        if (g > 200 && r < 100 && b < 100) {
            const x = (i / 4) % canvas.width;
            const y = Math.floor((i / 4) / canvas.width);
                greenSquares.push({ x, y });
            }
        }
}

// Exporta a função com os quadrados verdes
export function getGreenSquares() {
    return greenSquares;
}

