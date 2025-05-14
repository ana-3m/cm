const jazzAudio = new Audio("./sound/hipjazz.mp3");
jazzAudio.loop = true;
jazzAudio.volume = 0.2;
import {map } from "./notas.js";
let musicStarted = false;
let fadeTimeout = null;
let fadeInterval = null;

window.debugJazz = jazzAudio;

export function tryPlayMusic() {
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
}


export function setVolumeFromRadius(radius, maxRadius) {
    const normalized = map(radius, 0, maxRadius, 1, 0 );
    jazzAudio.volume = normalized;
}


export function fadeOutMusicAfterDelay(delay = 1000, fadeStep = 0.02) {
    if (fadeTimeout) clearTimeout(fadeTimeout);
    if (fadeInterval) clearInterval(fadeInterval);

    fadeTimeout = setTimeout(() => {
        fadeInterval = setInterval(() => {
            if (jazzAudio.volume > 0.05) {
                jazzAudio.volume = Math.max(0, jazzAudio.volume - fadeStep);
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
    jazzAudio.pause();
    jazzAudio.currentTime = 0;
    musicStarted = false;
}
