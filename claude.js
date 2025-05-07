// Improved Tic-Tac-Toe Game
const bigbox = document.getElementById("bigbox");

// Game state object
const state = {
  x: [],
  o: [],
  currentPlayer: "x", // Track current player
  gameOver: false,
  intervalId: null,
};

// Win combinations
const winCombinations = [
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9], // columns
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9], // rows
  [1, 5, 9],
  [3, 5, 7], // diagonals
];

// Initialize game elements
const time_x = document.getElementById("timer-x");
const time_o = document.getElementById("timer-o");

// Track game state more efficiently
function updateGameState() {
  if (state.gameOver) return;

  // Clear previous state
  state.x = [];
  state.o = [];

  // Update current state
  for (let i = 1; i <= 9; i++) {
    const box = document.getElementById(`box${i}`);
    const img = box ? box.querySelector("img") : null;

    if (img) {
      if (img.src.includes("x.png")) {
        // Keep only the last 4 moves for X
        if (state.x.length >= 4) {
          state.x.pop(); // Remove oldest
        }
        state.x.unshift(i);
      } else if (img.src.includes("o.png")) {
        // Keep only the last 4 moves for O
        if (state.o.length >= 4) {
          state.o.pop(); // Remove oldest
        }
        state.o.unshift(i);
      }
    }
  }

  // Check for winner immediately after state update
  checkWinner();
}

// Start game state tracking
function startGameTracking() {
  // Clear any existing interval
  if (state.intervalId) {
    clearInterval(state.intervalId);
  }

  // Set a new interval to update game state
  state.intervalId = setInterval(() => {
    updateGameState();
  }, 500); // Check every half second for better responsiveness
}

// Check for winner
function checkWinner() {
  if (state.gameOver) return;

  for (const combo of winCombinations) {
    if (combo.every((i) => state.x.includes(i))) {
      popup("Player - X wins!");
      stopGame();
      return;
    }
    if (combo.every((i) => state.o.includes(i))) {
      popup("Player - O wins!");
      stopGame();
      return;
    }
  }

  // Check for draw - if all boxes are filled
  const allBoxesFilled = Array.from({ length: 9 }, (_, i) => i + 1).every(
    (i) => {
      const box = document.getElementById(`box${i}`);
      return box && box.querySelector("img");
    }
  );

  if (allBoxesFilled && !state.gameOver) {
    popup("It's a draw!");
    stopGame();
  }
}

// Stop the game
function stopGame() {
  state.gameOver = true;

  // Clear interval
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }

  // Make all pieces non-draggable
  non_draggable(document.getElementById("pieces-x"));
  non_draggable(document.getElementById("pieces-o"));
}

// Restart the game
function restartGame() {
  // Reset game state
  state.x = [];
  state.o = [];
  state.gameOver = false;
  state.currentPlayer = "x";

  // Clear all boxes
  for (let i = 1; i <= 9; i++) {
    const box = document.getElementById(`box${i}`);
    if (box) {
      const img = box.querySelector("img");
      if (img) {
        box.removeChild(img);
      }
    }
  }

  // Reset timers
  if (time_x && time_x.firstChild) {
    time_x.firstChild.innerText = "2";
  }
  if (time_o && time_o.firstChild) {
    time_o.firstChild.innerText = "2";
  }

  // Start game tracking again
  startGameTracking();

  // Start game loop
  gameLoop();
}

// Player X object
const X_user = {
  pieces: () => {
    const pieces_remaining = document.getElementById("pieces-x");
    const pieces = pieces_remaining
      ? pieces_remaining.querySelectorAll("img")
      : [];
    if (pieces.length === 0) {
      popup("X-You are out of moves now!");
    }
  },
  timer: function Timer() {
    let counter = 2;
    return new Promise((resolve, reject) => {
      if (state.gameOver) {
        resolve();
        return;
      }

      state.currentPlayer = "x";

      const input_x = document.getElementById("pieces-x");
      is_draggable(input_x);
      non_draggable(document.getElementById("pieces-o"));

      const intervalId = setInterval(() => {
        if (state.gameOver) {
          clearInterval(intervalId);
          resolve();
          return;
        }

        const time = time_x.firstChild;
        if (!time) {
          clearInterval(intervalId);
          resolve();
          return;
        }

        time.innerText = counter;
        counter--;

        if (counter < 0) {
          non_draggable(input_x);
          clearInterval(intervalId);
          resolve();
        }
      }, 1000);
    });
  },
};

// Player O object
const O_user = {
  pieces: () => {
    const pieces_remaining = document.getElementById("pieces-o");
    const pieces = pieces_remaining
      ? pieces_remaining.querySelectorAll("img")
      : [];
    if (pieces.length === 0) {
      popup("O-You are out of moves now!");
    }
  },
  timer: function Timer() {
    let counter = 2;
    return new Promise((resolve, reject) => {
      if (state.gameOver) {
        resolve();
        return;
      }

      state.currentPlayer = "o";

      const input_o = document.getElementById("pieces-o");
      is_draggable(input_o);
      non_draggable(document.getElementById("pieces-x"));

      const intervalId = setInterval(() => {
        if (state.gameOver) {
          clearInterval(intervalId);
          resolve();
          return;
        }

        const time = time_o.firstChild;
        if (!time) {
          clearInterval(intervalId);
          resolve();
          return;
        }

        time.innerText = counter;
        counter--;

        if (counter < 0) {
          non_draggable(input_o);
          clearInterval(intervalId);
          resolve();
        }
      }, 1000);
    });
  },
};

// Show message popup
function popup(message) {
  const message_box = document.getElementById("popup");
  if (!message_box) return;

  // Create and append the message
  let text = document.createElement("h1");
  text.innerText = message;
  message_box.appendChild(text);

  // Show the popup
  var popup = document.getElementById("popup-background");
  if (popup) {
    popup.style.display = "block";

    // Hide popup after 5 seconds
    setTimeout(() => {
      popup.style.display = "none";
      // Remove the text after hiding
      if (text && text.parentNode) {
        text.parentNode.removeChild(text);
      }
    }, 5000);

    // Allow clicking outside to close
    window.onclick = function (event) {
      if (event.target == popup) {
        popup.style.display = "none";
        if (text && text.parentNode) {
          text.parentNode.removeChild(text);
        }
      }
    };
  }

  // Stop the game if it's a win/draw message
  if (message.includes("wins") || message.includes("draw")) {
    stopGame();
  }
}

// Make elements draggable
function is_draggable(container) {
  if (!container) return;
  const pieces = container.querySelectorAll("img");
  pieces.forEach((piece) => {
    piece.setAttribute("draggable", "true");
  });
}

// Make elements non-draggable
function non_draggable(container) {
  if (!container) return;
  const pieces = container.querySelectorAll("img");
  pieces.forEach((piece) => {
    piece.setAttribute("draggable", "false");
  });
}

// Player turns
async function turns() {
  if (state.gameOver) return;

  await X_user.timer(); // Player X's turn
  updateGameState(); // Check for winner after X's turn

  if (!state.gameOver) {
    await O_user.timer(); // Player O's turn
    updateGameState(); // Check for winner after O's turn
  }
}

// Game loop
async function gameLoop() {
  if (state.gameOver) return;

  try {
    while (!state.gameOver) {
      await turns(); // X then O
    }
  } catch (error) {
    console.error("Game loop error:", error);
  }
}

// Handle piece removal after timeout
function handlePieceRemoval() {
  // Select all boxes
  document.querySelectorAll(".boxes .box").forEach((box) => {
    // Create a MutationObserver to watch for added nodes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // Check if any of the added nodes are images
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === "IMG") {
              // Set timeout to remove the image after 18 seconds
              setTimeout(() => {
                if (!state.gameOver && node.parentNode === box) {
                  box.removeChild(node);
                  updateGameState(); // Update game state after removal
                }
              }, 18000);
            }
          });
        }
      });
    });

    // Start observing the box for changes
    observer.observe(box, { childList: true });
  });
}

// Drag and drop functionality
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  if (state.gameOver) return;
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  if (state.gameOver) return;
  event.preventDefault();

  // Only allow drop if the target doesn't already have an image
  if (
    event.target.classList.contains("box") &&
    !event.target.querySelector("img")
  ) {
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    // Check if the current player matches the piece being dragged
    const isXPiece = draggedElement.src.includes("x.png");
    const isOPiece = draggedElement.src.includes("o.png");

    if (
      (isXPiece && state.currentPlayer === "x") ||
      (isOPiece && state.currentPlayer === "o")
    ) {
      event.target.appendChild(draggedElement);
      updateGameState(); // Update game state after drop
    }
  }
}

// Initialize the game
function initGame() {
  // Set up drag and drop handlers for boxes
  document.querySelectorAll(".box").forEach((box) => {
    box.ondragover = allowDrop;
    box.ondrop = drop;
  });

  // Start game tracking
  startGameTracking();

  // Set up piece removal
  handlePieceRemoval();

  // Start game loop
  gameLoop();

  // Add restart button functionality if there's a restart button
  const restartButton = document.getElementById("restart-button");
  if (restartButton) {
    restartButton.addEventListener("click", restartGame);
  }
}

// Initialize when the document is loaded
document.addEventListener("DOMContentLoaded", initGame);
