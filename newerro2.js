const canvas = document.getElementById("erro");
const erro = canvas.getContext("2d");

//Tamanho do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pulseImg = new Image();
pulseImg.src = "img/pulse.png";

let opacity = 0.5; // Opacidade inicial média
let time = 0; // Controle do tempo para pulsação
const pulseSpeed = 0.08; // Velocidade da pulsação
let animationRunning = false; // Flag para evitar reinicialização da animação

export async function drawPulsingBlur() {
    if (animationRunning) return; // Se já estiver rodando, não inicia de novo
    animationRunning = true; // Marca a animação como ativa

    function animate() {
        erro.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

        // Efeito de batimento cardíaco usando Math.sin
        opacity = 0.5 + Math.sin(time) * 0.2;
        time += pulseSpeed;

        erro.globalAlpha = opacity;
        erro.drawImage(pulseImg, 0, 0, canvas.width, canvas.height);

        requestAnimationFrame(animate); // Mantém a animação contínua
    }

    animate(); // Inicia o loop da animação uma única vez
}

export function resetPulsingBlur() {
    opacity = 0.5;
    time = 0;
    animationRunning = false;
    erro.clearRect(0, 0, canvas.width, canvas.height);
}
