const intro = document.querySelector('#introCanvas');

const hall = new Image();
hall.src = "img/entrada.png";
intro.width = innerWidth;
intro.height = innerHeight; 

const canvas = intro.getContext("2d");

async function drawIntro() {
    canvas.clearRect(0, 0, intro.width, intro.height);
    canvas.drawImage(hall, 0, 0, intro.width, intro.height);
} 

setTimeout(() => {
    drawIntro();
}, 500); 