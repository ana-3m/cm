const messages = [
  "DON'T STOP",
  "FAS TER !",
  "TOO SLOW",
  "DO YOU WANT TO BE HERE?"
];

// Configuration
const validRows = [1, 2, 3, 4, 5];
const restrictedCols = [2, 3, 6, 7, 8, 11];
const cols = 11;

// DOM elements
const grid = document.getElementById('grid');
const messageElements = [];
let currentIndex = 0;
let messageTimeoutId = null;

// Initialize grid elements
function initializeElements() {
  // Clear existing elements
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  messageElements.length = 0;

  // Create all possible grid cells
  for (let row of validRows) {
    for (let col = 1; col <= cols; col++) {
      const div = document.createElement('div');
      div.className = 'char-group';
      div.style.display = 'none';
      div.style.gridRow = row;
      div.style.gridColumn = col;

      // Only add if not in restricted columns
      if (!restrictedCols.includes(col)) {
        grid.appendChild(div);
        messageElements.push({
          element: div,
          row,
          col,
          index: (row - 1) * cols + (col - 1)
        });
      }
    }
  }
}

// Initialize immediately
initializeElements();

export function showNextMessage() {
  // Clear previous timeout
  if (messageTimeoutId) {
    clearTimeout(messageTimeoutId);
  }

  // Hide all elements
  messageElements.forEach(item => {
    item.element.style.display = 'none';
  });

  const message = messages[currentIndex];
  const parts = message.split(' ');

  // Sort available positions from left to right, top to bottom
  const availablePositions = [...messageElements]
    .sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });

  // Assign parts to positions in order
  parts.forEach((part, i) => {
    if (i < availablePositions.length) {
      const position = availablePositions[i];
      
      position.element.textContent = part;
      position.element.style.display = 'block';
    }
  });

  // Move to next message
  currentIndex = (currentIndex + 1) % messages.length;

  // Schedule next message
  messageTimeoutId = setTimeout(showNextMessage, 5000);
}

// Initial display
showNextMessage();