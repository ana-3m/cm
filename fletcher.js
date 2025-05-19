import { sendUserBackToIntro } from "./main.js";

// Defina os "Fletcher phrases" – você pode colocar isso num módulo, por exemplo, fletcher.js
const fraseFletcher = {
    lockedDoor: {
        p: "Who dares to interrupt my class?",
        x: "tap here to continue"
    },
    expelled: {
        p: "You're not ready yet!",
        x: "tap here to continue"
    },
    training: {
        p: "Go train some more, and then come back when I say.",
        x: "tap here to continue"
    },
    encoraje2: {
        p: "Meet me in my class!",
        x: "tap here to continue"
    }
};

// Seleciona os elementos do popup (neste caso, a barra inferior)
const bar = document.getElementById('bottomBar');
const content = document.getElementById('content');

// Função para mostrar a mensagem de Fletcher com base em uma chave
export function showFletcherPhrase(key) {
    // Verifica se a chave existe
    if (fraseFletcher[key]) {
        const phrase = fraseFletcher[key];
        // Atualiza o conteúdo do popup
        content.innerHTML = `
            <div class="fletcher-message">
                <p id="textF">${phrase.p}</p>
                <p id="continue">${phrase.x}</p>
            </div>
        `;
        // Exibe o container (barra inferior)
        bar.classList.remove('hidden');
    }
}

// Função para esconder a barra
export function hideFletcherPhrase() {
    bar.classList.add('hidden');
    content.innerHTML = "";
}

// Exemplo: Esconder mensagem ao clicar na própria barra
bar.addEventListener('click', () => {
    hideFletcherPhrase();
    sendUserBackToIntro();
});