import { sendUserBackToIntro } from "./notas.js";

let introHasStarted = false;

export function start() {
    if (introHasStarted) return; // Cancela se já começou
    introHasStarted = true; // Marca como iniciado

    const introText1 = document.getElementById("introText1");
    const introText2 = document.getElementById("introText2");
    const welcome = document.getElementById("welcome");
    const intro = document.getElementById("intro");
    const canvasInicial = document.getElementById("cenaInicial");

    // Adicionando áudio do metrônomo
    const metronome = new Audio("sound/metronome.mp3");
    metronome.loop = true;
    metronome.volume = 0;

    if (getComputedStyle(canvasInicial).display !== "none") {
        document.getElementById("startScreen").classList.add("hidden");
        metronome.play();


        // Aplica fade in para alcançar o volume desejado (por exemplo, 0.3) em 2 segundos
        fadeInAudio(metronome, 0.3, 2000);

        // Mostra o texto gradualmente após 2 segundos
        setTimeout(() => {
            introText1.classList.remove("hidden");
        }, 5000);
        setTimeout(() => {
            introText1.classList.add("hidden");
            introText2.classList.remove("hidden");
        }, 10000);
        setTimeout(() => {
            introText2.classList.add("hidden");
            welcome.classList.remove("hidden");
        }, 15000);
        setTimeout(() => {
            welcome.classList.add("hidden");
        }, 20000);

        // Som da porta abrindo após 5 segundos
        setTimeout(() => {
            // const doorSound = new Audio("sound/doorOpen.mp3");
            //doorSound.play();

            // Iniciar fadeOut aos 15s, para acabar aos 18s
            setTimeout(() => {
                fadeOutAudio(metronome, 3000); // 3s fade
            }, 15000); // Inicia após 15s


            // Desaparecer tela preta e iniciar o jogo
            setTimeout(() => {
                //canvasInicial.style.opacity = "0";
                canvasInicial.classList.add("hidden");
                intro.classList.remove("hidden");
                sendUserBackToIntro();
            }, 17000);
        }, 3000);
    }
}

// Função para aplicar fade in no áudio
function fadeInAudio(audio, targetVolume, duration) {
    let currentVolume = 0;
    audio.volume = currentVolume;
    const steps = 50;
    const stepTime = duration / steps;
    const stepAmount = targetVolume / steps;

    const fadeInInterval = setInterval(() => {
        currentVolume += stepAmount;
        if (currentVolume >= targetVolume) {
            audio.volume = targetVolume;
            clearInterval(fadeInInterval);
        } else {
            audio.volume = currentVolume;
        }
    }, stepTime);
}

// Função para aplicar fade out no áudio
function fadeOutAudio(audio, duration) {
    let currentVolume = audio.volume;
    const steps = 50;
    const stepTime = duration / steps;
    const stepAmount = currentVolume / steps;

    const fadeOutInterval = setInterval(() => {
        currentVolume -= stepAmount;
        if (currentVolume <= 0) {
            audio.volume = 0;
            clearInterval(fadeOutInterval);
        } else {
            audio.volume = currentVolume;
        }
    }, stepTime);
}
