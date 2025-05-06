//Ficheiro que cria os erros que aparecem no jogo

const canvas = document.getElementById("erro");
const erro = canvas.getContext("2d");

//Tamanho do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Carrega as imagens 
const varetaImg = new Image();
varetaImg.src = "img/vareta.png";
const brokenScreenImg = new Image();
brokenScreenImg.src = "img/brokenScreen.png";

// Propriedades da vareta
let vareta = {
    x: canvas.width / 2,
    y: -200,
    angle: 0,
    speedY: 10,
    rotationSpeed: 3
};

let animationStopped = false; //Flag para parar a animação

export async function animateVareta() {
    erro.clearRect(0, 0, canvas.width, canvas.height);

    if (!animationStopped) {
        //Modifica a posição e angulo da vareta
        vareta.y += vareta.speedY;
        vareta.angle += vareta.rotationSpeed * (Math.PI / 180); 
        if (vareta.x > canvas.width * 0.10) {
            vareta.x -= vareta.speedY;
        }

        //Aplica a rotação e translação da vareta e desenha-a
        erro.save();
        erro.translate(vareta.x, vareta.y); 
        erro.rotate(vareta.angle); // Roda o canvas inteiro da vareta
        erro.drawImage(varetaImg, varetaImg.width, varetaImg.height);
        erro.restore();

        requestAnimationFrame(() => animateVareta()); //Obriga a repetição da animação
    } else {
        requestAnimationFrame(() => drawBrokenScreen()); //Obriga a repetição da animação
    }
    if (vareta.y >= canvas.height) {
        animationStopped = await true;
        console.log("Animation stopped", animationStopped);

    }
}

function drawBrokenScreen() {
    //Desenha o ecrâ partido
    erro.drawImage(brokenScreenImg, 0, 0, canvas.width, canvas.height);

}

