//const jazzAudio = new Audio("./sound/hipjazz.mp3");
//jazzAudio.loop = true;
//jazzAudio.volume = 0.2;
import { map } from "./notas.js";
//let musicStarted = false;
let fadeTimeout = null;
let fadeInterval = null;

//window.debugJazz = jazzAudio;

/******************************* TESTE ***********************************/
let currentAudio = null; // Música em reprodução
let musicStarted = false;

export function tryPlayMusic(musicFile) {
    if (!musicFile) {
        console.warn("Nenhuma música selecionada no `tryPlayMusic()`!");
        return;
    }

    console.log("Tentando tocar:", musicFile); // Teste

    if (!musicStarted) {
        if (currentAudio) {
            currentAudio.pause();
        }

        currentAudio = new Audio(musicFile);
        currentAudio.loop = true;
        currentAudio.volume = 0.2;

        currentAudio.play()
            .then(() => {
                musicStarted = true;
                console.log("Música tocando:", musicFile);
            })
            .catch(err => {
                console.warn("Autoplay bloqueado:", err);
            });
    }
}

/*export function tryPlayMusic() {
    if (!musicStarted) {
        jazzAudio.play()
            .then(() => {
                musicStarted = true;
                console.log(" Music started");
            })
            .catch(err => {
                console.warn(" Autoplay blocked:", err);
            });
    }
}*/

let normalized;
export function setVolumeFromRadius(radius, maxRadius) {
    if (!currentAudio) {
        console.warn("Nenhuma música ativa!");
        return;
    }

    if (radius < maxRadius) {
        const normalized = map(radius, 0, maxRadius, 1, 0);
        currentAudio.volume = normalized;
    }
}


export function fadeOutMusicAfterDelay(delay = 1000, fadeStep = 0.02) {
    if (fadeTimeout) clearTimeout(fadeTimeout);
    if (fadeInterval) clearInterval(fadeInterval);

    fadeTimeout = setTimeout(() => {
        fadeInterval = setInterval(() => {
            if (currentAudio.volume > 0.05) {
                currentAudio.volume = Math.max(0, currentAudio.volume - fadeStep);
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    }, delay);
}

export function cancelFadeOut() {
    if (fadeTimeout) {
        clearTimeout(fadeTimeout);
        fadeTimeout = null;
    }
    if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
    }
}

export function resetMusic() {
    cancelFadeOut();
    currentAudio.pause();
    currentAudio.currentTime = 0;
    musicStarted = false;
}
