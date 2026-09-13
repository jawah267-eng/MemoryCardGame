const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const playerNameInput = document.getElementById("playerName");
const startButton = document.getElementById("startButton");
const levelOptions = document.querySelectorAll(".level-option");
const restartButton = document.getElementById("restartButton");
const menuButton = document.getElementById("menuButton");
const playerLabel = document.getElementById("playerLabel");
const levelLabel = document.getElementById("levelLabel");
const cardGrid = document.getElementById("cardGrid");
const timeDisplay = document.getElementById("level2Time");
const attemptsDisplay = document.getElementById("level2Attempts");
const bestTimeDisplay = document.getElementById("level2BestTime");
const bestAttemptsDisplay = document.getElementById("level2BestAttempts");
const gameMessage = document.getElementById("gameMessage");

const imagePaths = [
  "ancient-samurai.png",
  "cursed-katana.png",
  "demon-samurai.png",
  "dragon-samurai.png",
  "ghost-samurai.png",
  "ghot-samurai.png",
  "lone-samurai.png",
  "meditating-samurai.png",
];
const numberValues = [1, 2, 3, 4, 5, 6, 7, 8];
let selectedLevel = "1";

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let seconds = 0;
let matchedPairs = 0;
let timer = null;
let gameStarted = false;

startButton.addEventListener("click", startGame);
levelOptions.forEach((option) => {
  option.addEventListener("click", () => {
    selectedLevel = option.dataset.level;
    levelOptions.forEach((item) => item.classList.remove("is-selected"));
    option.classList.add("is-selected");
  });
});
restartButton.addEventListener("click", restartGame);
menuButton.addEventListener("click", showMainMenu);
playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startGame();
  }
});

updateBestScores();

function startGame() {
  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    playerNameInput.focus();
    playerNameInput.setCustomValidity("Please enter your name.");
    playerNameInput.reportValidity();
    return;
  }

  playerNameInput.setCustomValidity("");
  playerLabel.textContent = playerName;
  levelLabel.textContent =
    selectedLevel === "1" ? "LEVEL 1 · NUMBERS" : "LEVEL 2 · IMAGES";
  updateBestScores();
  startScreen.hidden = true;
  gameScreen.hidden = false;
  restartGame();
}

function restartGame() {
  clearInterval(timer);
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  attempts = 0;
  seconds = 0;
  matchedPairs = 0;
  gameStarted = false;
  timeDisplay.textContent = formatTime(seconds);
  attemptsDisplay.textContent = attempts;
  gameMessage.textContent = "";
  cardGrid.replaceChildren();

  const values = selectedLevel === "1" ? numberValues : imagePaths;
  const cards = shuffle([...values, ...values]);
  cards.forEach((value, index) => {
    cardGrid.appendChild(createCard(value, index));
  });
}

function createCard(value, index) {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.dataset.value = value;
  card.setAttribute("aria-label", `Memory card ${index + 1}`);
  card.addEventListener("click", flipCard);

  const front = document.createElement("span");
  front.className = "card-face card-front";
  if (selectedLevel === "1") {
    front.classList.add("number-face");
    front.textContent = value;
  } else {
    const image = document.createElement("img");
    image.src = `./images/${value}`;
    image.alt = "";
    front.appendChild(image);
  }

  const back = document.createElement("span");
  back.className = "card-face card-back";
  back.setAttribute("aria-hidden", "true");

  card.append(front, back);
  return card;
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains("matched")) {
    return;
  }

  startTimer();
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  attempts += 1;
  attemptsDisplay.textContent = attempts;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matchedPairs += 1;
  resetBoard();

  const totalPairs =
    selectedLevel === "1" ? numberValues.length : imagePaths.length;
  if (matchedPairs === totalPairs) {
    finishGame();
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 850);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function startTimer() {
  if (gameStarted) {
    return;
  }

  gameStarted = true;
  timer = setInterval(() => {
    seconds += 1;
    timeDisplay.textContent = formatTime(seconds);
  }, 1000);
}

function finishGame() {
  clearInterval(timer);
  gameMessage.textContent = `Well done, ${playerLabel.textContent}! You matched all 8 pairs.`;
  saveBestScores();
}

function saveBestScores() {
  const bestTimeKey = getBestTimeKey();
  const bestAttemptsKey = getBestAttemptsKey();
  const savedTime = Number(localStorage.getItem(bestTimeKey));
  const savedAttempts = Number(localStorage.getItem(bestAttemptsKey));

  if (!savedTime || seconds < savedTime) {
    localStorage.setItem(bestTimeKey, seconds);
  }

  if (!savedAttempts || attempts < savedAttempts) {
    localStorage.setItem(bestAttemptsKey, attempts);
  }

  updateBestScores();
}

function updateBestScores() {
  const bestTimeKey = getBestTimeKey();
  const bestAttemptsKey = getBestAttemptsKey();
  const savedTime = localStorage.getItem(bestTimeKey);
  const savedAttempts = localStorage.getItem(bestAttemptsKey);
  bestTimeDisplay.textContent = savedTime ? formatTime(savedTime) : "--:--";
  bestAttemptsDisplay.textContent = savedAttempts || "--";
}

function getBestTimeKey() {
  return `memoryGameLevel${selectedLevel}BestTime`;
}

function getBestAttemptsKey() {
  return `memoryGameLevel${selectedLevel}BestAttempts`;
}

function showMainMenu() {
  clearInterval(timer);
  gameScreen.hidden = true;
  startScreen.hidden = false;
  gameMessage.textContent = "";
}

function formatTime(value) {
  const totalSeconds = Number(value) || 0;
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }

  return items;
}
