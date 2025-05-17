const canvas = document.getElementById("erro");
const erro = canvas.getContext("2d");

//Tamanho do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const blurImg = new Image();
blurImg.src = "img/blur.png";

let opacity = 0; // Inicializa a opacidade no valor mínimo
const fadeSpeed = 0.02; // Ajuste a velocidade do efeito

export async function drawBlurryScreen() {
    erro.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    // Define a opacidade da imagem
    erro.globalAlpha = opacity;
    erro.drawImage(blurImg, 0, 0, canvas.width, canvas.height);

    // Incrementa a opacidade até o máximo (1.0)
    if (opacity < 1) {
        opacity += fadeSpeed;
        requestAnimationFrame(drawBlurryScreen); // Chama a função novamente para criar o efeito gradativo
    }
}

export function resetBlurryScreen() {
    opacity = 0; // Reset opacity
    const erroCanvas = document.getElementById("erro");
    erroCanvas.getContext("2d").clearRect(0, 0, erroCanvas.width, erroCanvas.height);
}
