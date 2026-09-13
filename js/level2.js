(() => {
  const imageSection = document.querySelector(".memory-game:has(.card)");
  const output = imageSection.querySelector("#output2");
  const levelTwoCards = [
    ...imageSection.querySelectorAll(":scope > .card"),
  ];
  let levelTwoFirstCard = null;
  let levelTwoSecondCard = null;
  let levelTwoLockBoard = false;

  shuffleCards(levelTwoCards);

  const shuffledCards = document.createDocumentFragment();
  levelTwoCards.forEach((card) => shuffledCards.appendChild(card));
  output.before(shuffledCards);

  levelTwoCards.forEach((card) => {
    const frontImage = card.querySelector("img:first-child");
    card.dataset.value = frontImage.src;
    card.addEventListener("click", flipCard);
  });

  function flipCard() {
    if (
      levelTwoLockBoard ||
      this === levelTwoFirstCard ||
      this.classList.contains("matched")
    ) {
      return;
    }

    this.classList.add("flipped");

    if (!levelTwoFirstCard) {
      levelTwoFirstCard = this;
      return;
    }

    levelTwoSecondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    const isMatch =
      levelTwoFirstCard.dataset.value === levelTwoSecondCard.dataset.value;

    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    levelTwoFirstCard.classList.add("matched");
    levelTwoSecondCard.classList.add("matched");
    levelTwoFirstCard.removeEventListener("click", flipCard);
    levelTwoSecondCard.removeEventListener("click", flipCard);
    resetBoard();
  }

  function unflipCards() {
    levelTwoLockBoard = true;

    setTimeout(() => {
      levelTwoFirstCard.classList.remove("flipped");
      levelTwoSecondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    levelTwoFirstCard = null;
    levelTwoSecondCard = null;
    levelTwoLockBoard = false;
  }

  function shuffleCards(cards) {
    for (let index = cards.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[randomIndex]] = [
        cards[randomIndex],
        cards[index],
      ];
    }
  }
})();
