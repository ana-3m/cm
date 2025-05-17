export function start() {
    const introText1 = document.getElementById("introText1");
    const introText2 = document.getElementById("introText2");
    const welcome = document.getElementById("welcome");
    const intro = document.getElementById("intro");

    // Adicionando áudio do metrônomo
    const metronome = new Audio("sound/metronome.mp3");
    metronome.loop = true;
    metronome.volume = 0;

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
    }, 10000); setTimeout(() => {
        introText2.classList.add("hidden");
        welcome.classList.remove("hidden");
    }, 15000);

    // Som da porta abrindo após 5 segundos
    setTimeout(() => {
        // const doorSound = new Audio("sound/doorOpen.mp3");
        //doorSound.play();

        // Fade out do metrônomo em 3 segundos
        fadeOutAudio(metronome, 18000);

        // Desaparecer tela preta e iniciar o jogo
        setTimeout(() => {
            document.getElementById("cenaInicial").style.opacity = "0";
            intro.classList.remove("hidden");
        }, 17000);
    }, 3000);
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
