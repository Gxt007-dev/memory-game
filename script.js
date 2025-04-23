
const emojiPool = ['🐶', '🐱', '🦊', '🐸', '🐵', '🦁', '🐼', '🐷', '🐮', '🐔', '🐧', '🦄'];
const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const restartBtn = document.getElementById("restart");
const levelSelect = document.getElementById("level");

let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let timer = 0;
let timerInterval;
let emojis = [];

const flipSound = new Audio("https://cdn.pixabay.com/download/audio/2022/10/09/audio_3ec1fe232e.mp3");
const matchSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_0f2d404e2b.mp3");
const winSound = new Audio("https://cdn.pixabay.com/download/audio/2022/10/31/audio_6a5dcbffb3.mp3");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
const themeSelect = document.getElementById("theme");

// Theme Switcher
themeSelect.addEventListener("change", () => {
  document.body.className = themeSelect.value;
});


function generateEmojis(level) {
  let pairs = 6;
  if (level === 'medium') pairs = 8;
  if (level === 'hard') pairs = 12;
  return shuffle([...emojiPool].slice(0, pairs).flatMap(e => [e, e]));
}

function createBoard() {
  gameBoard.innerHTML = "";
  gameBoard.className = `game-board ${levelSelect.value}`;
  matchedCount = 0;
  flippedCards = [];
  moves = 0;
  movesDisplay.innerText = "Moves: 0";

  emojis = generateEmojis(levelSelect.value);
  emojis.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerText = '';
    gameBoard.appendChild(card);

    card.addEventListener("click", () => {
      if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.innerText = emoji;
        flippedCards.push(card);
        flipSound.play();

        if (flippedCards.length === 2) {
          moves++;
          movesDisplay.innerText = `Moves: ${moves}`;
          setTimeout(checkMatch, 600);
        }
      }
    });
  });
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.emoji === card2.dataset.emoji) {
    matchedCount += 2;
    matchSound.play();
    if (matchedCount === emojis.length) {
      winSound.play();
      clearInterval(timerInterval);
      setTimeout(() => alert(`🎉 You finished in ${timer}s with ${moves} moves!`), 400);
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.innerText = '';
    card2.innerText = '';
  }

  flippedCards = [];
}

function startTimer() {
  timer = 0;
  timerDisplay.innerText = "Time: 0s";
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.innerText = `Time: ${timer}s`;
  }, 1000);
}

restartBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  startGame();
});

levelSelect.addEventListener("change", () => {
  clearInterval(timerInterval);
  startGame();
});

function startGame() {
  createBoard();
  startTimer();
}

startGame();
