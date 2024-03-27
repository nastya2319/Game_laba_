const cards = document.querySelectorAll('.memory-card');
const movesDisplay = document.querySelector('.moves');
const timerDisplay = document.querySelector('.timer');
const congratulations = document.querySelector('.congratulations');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let timerInterval;
let seconds = 0;
let matchedPairs = 0;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains('matched')) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
  incrementMoves();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    disableCards();
    matchedPairs++;
    checkGameOver();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function incrementMoves() {
  moves++;
  movesDisplay.textContent = `Ходы: ${moves}`;
}

let timerStarted = false;

function startTimer() {
  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(() => {
      seconds++;
      timerDisplay.textContent = `Время: ${seconds}с`;
    }, 1000);
  }
}


function stopTimer() {
  clearInterval(timerInterval);
}

function checkGameOver() {
  if (matchedPairs === cards.length / 2) {
    stopTimer();
    showCongratulations();
  }
}

function showCongratulations() {
  congratulations.classList.remove('hidden');
}

function restartGame() {
  location.reload();
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', function() {
  if (moves === 0) {
    startTimer();
  }
  flipCard.call(this);
}));



let hintAvailable = true;

function showHint() {
  if (!hintAvailable) return;

  const unmatchedCards = Array.from(cards).filter(card => !card.classList.contains('matched'));
  if (unmatchedCards.length < 2) return;

  hintAvailable = false;

  const randomIndex = Math.floor(Math.random() * unmatchedCards.length);
  const hintCard = unmatchedCards[randomIndex];

  const framework = hintCard.dataset.framework;
  const otherCard = unmatchedCards.find(card => card.dataset.framework === framework && card !== hintCard);

  if (otherCard) {
    hintCard.classList.add('hint');
    otherCard.classList.add('hint');

    setTimeout(() => {
      hintCard.classList.remove('hint');
      otherCard.classList.remove('hint');
      hintAvailable = true;
    }, 500);
  } else {
    hintAvailable = true;
  }
}


