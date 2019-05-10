// Globals
let openCards = [];
let moves = 0;
let matches = 0;
let startTime = null;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  const cards = array;
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    cards[currentIndex] = array[randomIndex];
    cards[randomIndex] = temporaryValue;
  }

  return cards;
}

const convertTime = () => {
  let timeDiff = Math.floor((new Date() - startTime) / 1000);

  const h = Math.floor(timeDiff / 3600);
  timeDiff = timeDiff >= 3600 ? (timeDiff - (3600 * h)) : timeDiff;
  const m = Math.floor(timeDiff / 60);
  timeDiff = timeDiff >= 60 ? (timeDiff - (60 * m)) : timeDiff;
  const s = timeDiff;
  return [h, m, s];
};

const timerLoop = () => {
  let displayString = '';
  let h;
  let m;
  let s;

  if (startTime) {
    [h, m, s] = convertTime();
    displayString = `Timer: ${h}:${m}:${s}`;
    setTimeout(timerLoop, 500);
  } else {
    displayString = 'Timer: 0:0:0';
  }
  document.getElementById('timer').innerHTML = displayString;
};

const startTimer = () => {
  if (!startTime) {
    startTime = new Date();
    timerLoop();
  }
};

const displayWinModal = () => {
  const [h, m, s] = convertTime();
  const starCount = document.getElementsByClassName('fa-star').length;
  document.getElementById('movesScore').innerHTML = moves;
  document.getElementById('starScore').innerHTML = starCount;
  document.getElementById('timeScore').innerHTML = `${h}:${m}:${s}`;
  document.getElementById('modal').style.display = 'block';
  document.getElementById('modalText').style.display = 'block';
};

const updateMoves = () => {
  const movesSpan = document.getElementById('moves');
  movesSpan.textContent = moves;
  if (moves === 10 || moves === 20 || moves === 30) {
    const stars = document.getElementsByClassName('stars')[0];
    stars.removeChild(stars.firstElementChild);
  }
};

const flipCardDown = (node) => {
  node.classList.remove('open', 'show');
  return node;
};

const compareCards = () => {
  moves += 1;
  updateMoves(moves);
  const card1 = openCards[0].firstElementChild.className;
  const card2 = openCards[1].firstElementChild.className;
  // compare icon class names
  if (card1 === card2) {
    matches += 1;
    if (matches === 8) {
      const endTime = new Date();
      displayWinModal(startTime, endTime);
      startTime = null;
    }
  } else {
    openCards.map(flipCardDown);
  }
  openCards.length = 0;
};

const flipCardUp = (node) => {
  startTimer();
  let card;
  // check if icon or card background was clicked
  if (node.path.length > 7) {
    [card] = node.path;
  } else {
    card = node.target;
  }

  // make sure face down cards clicked and only 2 cards max are face up
  if (card.className !== 'card open show' && openCards.length < 2) {
    card.classList.add('open', 'show');
    openCards.push(card);
    if (openCards.length === 2) {
      setTimeout(compareCards, 1000);
    }
  }
};

const shuffleCards = () => {
  const cardsObj = document.getElementsByClassName('card');
  let cards = [];
  // Transform HTMLCollection into Array of Nodes
  for (const card of cardsObj) {
    cards.push(flipCardDown(card));
  }
  const deck = document.getElementsByClassName('deck')[0];
  cards = shuffle(cards);
  // remove cards from deck
  while (deck.firstChild) {
    deck.removeChild(deck.firstChild);
  }
  // add shuffled cards to deck
  cards.map((card) => {
    card.addEventListener('click', e => flipCardUp(e));
    deck.appendChild(card);
    return null;
  });
};

const resetStars = () => {
  const stars = document.getElementsByClassName('stars')[0];
  stars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
};

const resetGame = () => {
  shuffleCards();
  resetStars();
  openCards = [];
  updateMoves(moves = 0);
  matches = 0;
  startTime = null;
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modalText').style.display = 'none';
};

const addResetListener = () => {
  const restart = document.getElementsByClassName('restart')[0];
  const playAgain = document.getElementById('playAgain');
  restart.addEventListener('click', resetGame);
  playAgain.addEventListener('click', resetGame);
};

shuffleCards();
addResetListener();
