/*NOTAS: como é teste basta que cliques na nota em cima da bateria  -> depois metemos na zona certa... teoriccamente é só ifs
         está num layout estranho pq estava a recriar a tela do telemovel sem programar responsividade :')
         mas pelos teus storyboards tenho de mudar o layout depois hahahah
         
         pelo menos temos alguma coisa por onde começar ig x)) */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let notes = [];
const laneX = [canvas.width*0.15, canvas.width*0.28,
     canvas.width*0.37, canvas.width*0.45, canvas.width*0.52, 
     canvas.width*0.66, canvas.width*0.80]; // Posições das colunas de notas
const noteRadius = 50;
const speed = 3;
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
    notes.push({ x: laneX[lane], y: 0, lane: lane });
}

let lost = false;
function update() {
    notes.forEach(note => note.y += speed);
    notes = notes.filter(note => {
        if (note.y > canvas.height) {
            lives--;
            lost = true;
            updateUI();
            return false;
        }
        //lost = false;
        return true;
    });
        
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(drumImg, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    notes.forEach(note => {
        ctx.beginPath();
        ctx.arc(note.x, note.y, noteRadius, 0, Math.PI * 2);
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
    notes.forEach((note, index) => {
        const dist = Math.sqrt((clickX - note.x) ** 2 + (clickY - note.y) ** 2);
        if (dist <= noteRadius) {
            notes.splice(index, 1);
            score++;
            updateUI();
        }
    });
});

function updateUI() {
    let livesNow;
    //document.getElementById("score").innerText = score;
    //document.getElementById("lives").innerText = lives;
    if (lost && lives != 0) {
        alert("NOT QUITE MY TEMPO! Lives: " + lives);
    } else if (lives <= 0) {
        alert("Game Over! Pontuação: " + score);
        location.reload();
    }
}

setInterval(spawnNote, 1000);
gameLoop();