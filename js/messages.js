//Ficheiro responsável por criar as mensagens que aparecem no jogo 

export const messages = [
  {
    id: "Encouragement",
    parts: [
      { text: "DON'T", col: 1, row: 3 },
      { text: "STOP", col: 7, row: 5 }
    ]
  },
  {
    id: "Reprimend",
    parts: [
      { text: "TOO", col: 1, row: 1 },
      { text: "SLOW", col: 9, row: 1 }
    ]
  },
  {
    id: "Encouragement",
    parts: [
      { text: "FASTER !!", col: 5, row: 5 },
    ]
  },
  {
    id: "Reprimend",
    parts: [
      { text: "YOU", col: 1, row: 2 },
      { text: "EVEN TRYING", col: 5, row: 5 },
      {text:"?", col: 11, row: 3}
    ]
  },
  {
    id: "Reprimend",
    parts: [
      { text: "NOT", col: 1, row: 2 },
      { text: "QUITE", col: 1, row: 3 },
      { text: "MY TEMPO", col: 6, row: 5 }
    ]
  },
  {
    id: "Encouragement",
    parts: [
      { text: "YOU", col: 1, row: 4 },
      { text: "BEHIND, HURRY", col: 5, row: 5 },
    ]
  }, {
    id: "Reprimend",
    parts: [
      { text: "WHAT", col: 1, row: 4 },
      { text: "ARE", col: 1, row: 5 },
      { text: "YOU DOING?", col: 5, row: 5 }
    ]
  }, {
    id: "Support",
    parts: [
      { text: "FINALLY", col: 1, row: 4 },
      { text: "KEEP IT UP!", col: 6, row: 5 }
    ]
  }, {
    id: "Support",
    parts: [
      { text: "YOU", col: 1, row: 3 },
      { text: "HAVE IT", col: 1, row: 4 },
      { text: "IN YOU", col: 9, row: 5 }
    ]
  }
];

// DOM elements
const grid = document.getElementById('grid');
const messageElements = new Map(); // Using Map for efficient lookup

//Criação da grelha 
function initializeElements() {
 // Elimina os elementos existentes
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  messageElements.clear();

  // Recolhe todas as posições únicas que sao necessárias para as frases
  const allPositions = new Set();
  messages.forEach(message => {
    message.parts.forEach(part => {
      allPositions.add(`${part.col},${part.row}`);
    });
  });

  allPositions.forEach(position => {
    const [col, row] = position.split(',').map(Number);
    const div = document.createElement('div');
    div.className = 'char-group';
    div.style.display = 'none';
    div.style.gridColumn = col;
    div.style.gridRow = row;
    grid.appendChild(div);
    messageElements.set(position, div);
  });
}

initializeElements();


export function getMessagesById(id) {
  return messages.filter(message => message.id === id);
}

// Função para mostrar a mensagem com base mo índice
export function showMessageByIndex(index) {
  if (index < 0 || index >= messages.length) return;
  if (index === null) return; // Check if index is null


  //Esconde todas os elementos
  messageElements.forEach(element => {
    element.style.display = 'none';
  });

  const currentMessage = messages[index];

  //Mostrar a mensagem atual
  currentMessage.parts.forEach(part => {
    const positionKey = `${part.col},${part.row}`;
    const element = messageElements.get(positionKey);
    if (element) {
      element.textContent = part.text;
      element.style.display = 'block';
    }
  });

  // Esconder a mensagem após 4 segundos
  setTimeout(() => {
    messageElements.forEach(element => {
      element.style.display = 'none'; // Hide all elements
    });
  }, 4000); // 4 seconds
}