let array = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];

function showCard(list) {
  const output = document.getElementById("output");
  output.textContent = "";

  for (let i = 0; i < list.length; i++) {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.value = list[i];

    const frontFace = document.createElement("div");
    frontFace.className = "front-face";

    const backFace = document.createElement("div");
    backFace.className = "back-face";
    backFace.textContent = list[i];

    card.append(frontFace, backFace);
    card.addEventListener("click", flipCard);

    output.appendChild(card);
  }
}

let hasflippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  this.classList.add("flipped");
  if (!hasflippedCard) {
    hasflippedCard = true;
    firstCard = this;
    return;
  } else {
    hasflippedCard = false;
    secondCard = this;

    checkForMatch();
  }
}
function checkForMatch() {
  let ismatch = firstCard.dataset.value === secondCard.dataset.value;

  ismatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1500);
}
function resetBoard() {
  [hasflippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}
function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [list[i], list[randomIndex]] = [list[randomIndex], list[i]];
  }
}

shuffle(array);
showCard(array);
