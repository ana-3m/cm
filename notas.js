/*NOTAS: */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let notes = [];
const laneX = [canvas.width * 0.15, canvas.width * 0.275,
canvas.width * 0.365, canvas.width * 0.45, canvas.width * 0.515,
canvas.width * 0.66, canvas.width * 0.79]; // Posições X de notas
const laneY = [canvas.height * 0.67, canvas.height * 0.31,
canvas.height * 0.76, canvas.height * 0.45, canvas.height * 0.65,
canvas.height * 0.76, canvas.height * 0.33]; // Posições Y de notas

const minRadius = 1;
const maxRadius = [155, 180, 133, 117, 50, 130, 225];
const growthRate = 0.5;
let score = 0;
let lives = 10;

// Carregar imagem da bateria
const drumImg = new Image();
drumImg.src = "img/drums.png";

drumImg.onload = () => {
    draw();
};

function spawnNote() {
    const lane = Math.floor(Math.random() * laneX.length);
    notes.push({ x: laneX[lane], y: laneY[lane], radius: minRadius, lane: lane });
}

let lost = false;
function update() {
    notes.forEach(note => {
        note.radius += growthRate;
    });

    notes = notes.filter(note => {
        if (note.radius >= maxRadius[note.lane]) {
            lives--;
            lost = true;
            updateUI();
            return false; // Remove a nota se crescer demais
        }
        lost = false;
        return true;
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(drumImg, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#D2242A";
    notes.forEach(note => {
        ctx.beginPath();
        ctx.arc(note.x, note.y, note.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = notes.length - 1; i >= 0; i--) { // Percorre de trás para frente
        const note = notes[i];
        const dist = Math.sqrt((clickX - note.x) ** 2 + (clickY - note.y) ** 2);
        if (dist <= note.radius) {
            notes.splice(i, 1); // Remove a nota corretamente
            score++;
            updateUI();
            break; // Garante que apenas uma nota é removida por clique
        }
    }
});

function updateUI() {
    /*if (lost && lives !== 0) {
        alert("NOT QUITE MY TEMPO! Lives: " + lives);
    } else if (lives <= 0) {
        alert("Game Over! Pontuação: " + score);
        location.reload();
    }*/
}

setInterval(spawnNote, 1000);
gameLoop();         