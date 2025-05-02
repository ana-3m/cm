const messages = [
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
      { text: "TOO", col: 6, row: 4 },
      { text: "SLOW", col: 8, row: 5 }
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
      { text: "EVEN TRYING?", col: 5, row: 5 }
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
let currentIndex = 0;
let messageTimeoutId = null;

// Initialize only the elements we actually need
function initializeElements() {
  // Clear existing elements
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  messageElements.clear();

  // Collect all unique positions from all messages
  const allPositions = new Set();
  messages.forEach(message => {
    message.parts.forEach(part => {
      allPositions.add(`${part.col},${part.row}`);
    });
  });

  // Create only the elements we need
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

// Initialize immediately
initializeElements();

export function showNextMessage() {
  // Clear previous timeout
  if (messageTimeoutId) {
    clearTimeout(messageTimeoutId);
  }

  // Hide all elements
  messageElements.forEach(element => {
    element.style.display = 'none';
  });

  const currentMessage = messages[currentIndex];

  // Display each part at its specified position
  currentMessage.parts.forEach(part => {
    const positionKey = `${part.col},${part.row}`;
    const element = messageElements.get(positionKey);
    if (element) {
      element.textContent = part.text;
      element.style.display = 'block';
    }
  });

  // Move to next message
  currentIndex = (currentIndex + 1) % messages.length;

  // Schedule next message
  messageTimeoutId = setTimeout(showNextMessage, 5000);
}

export function getMessagesById(id) {
  return messages.filter(message => message.id === id);
}

// Function to show a specific message by index
export function showMessageByIndex(index) {
  if (index < 0 || index >= messages.length) return;

  // Clear previous timeout
  if (messageTimeoutId) {
    clearTimeout(messageTimeoutId);
  }

  // Hide all elements
  messageElements.forEach(element => {
    element.style.display = 'none';
  });

  const currentMessage = messages[index];

  // Display each part at its specified position
  currentMessage.parts.forEach(part => {
    const positionKey = `${part.col},${part.row}`;
    const element = messageElements.get(positionKey);
    if (element) {
      element.textContent = part.text;
      element.style.display = 'block';
    }
  });

  // Move to next message
  currentIndex = (index + 1) % messages.length;

  // Schedule next message
  messageTimeoutId = setTimeout(() => showNextMessage(), 5000);
}

// Initial display
showNextMessage();