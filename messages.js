const messages = [
    "DON'T STOP",
    "FAS TER !",
    "TOO SLOW",
  ];
  
  let currentIndex = 0;
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  export function showNextMessage() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    const message = messages[currentIndex];
    const parts = message.split(" "); // Keep the message parts in order

    const validRows = [1, 2, 3, 4, 5]; // Allowed rows
    const restrictedCols = [3, 6, 7, 8]; // Columns to restrict
    const cols = 11;

    const usedCells = new Set();

    parts.forEach((part, index) => {
        let cellIndex;
        let row, col;

        do {
            row = validRows[Math.floor(index % validRows.length)]; // Assign rows in order
            col = (index % cols) + 1; // Assign columns in order
            cellIndex = `${row}-${col}`;
        } while (usedCells.has(cellIndex) || restrictedCols.includes(col)); // Restrict certain columns

        usedCells.add(cellIndex);

        const div = document.createElement('div');
        div.className = 'char-group';
        div.style.gridRow = row;
        div.style.gridColumn = col;
        div.textContent = part;

        grid.appendChild(div);
    });

    currentIndex = (currentIndex + 1) % messages.length;
    //setTimeout(showNextMessage, 4000);
}
  
  

  