//Globals
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
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
const convertTime = () => {
    let timeDiff = Math.floor((new Date() - startTime) / 1000);
        
    h = Math.floor(timeDiff / 3600);
    timeDiff = timeDiff >= 3600 ? (timeDiff - (3600 * h)) : timeDiff;
    m = Math.floor(timeDiff / 60);
    timeDiff = timeDiff >= 60 ? (timeDiff - (60 * m)) : timeDiff;
    s = timeDiff;
    return [h, m, s];
}

const timerLoop = () => {
    let displayString = '';
    let h;
    let m;
    let s;

    if (startTime){
        [h, m, s] = convertTime();
        displayString = `Timer: ${h}:${m}:${s}`;
        setTimeout(timerLoop, 500);
    } else {
        displayString = 'Timer: 0:0:0'
    }
    document.getElementById('timer').innerHTML = displayString;
    
  }

const startTimer = () =>{
    if (!startTime) {
        startTime = new Date();
        timerLoop();

    }
}

const displayWinModal = () => {
    const [h, m, s] = convertTime();
    starCount = document.getElementsByClassName('fa-star').length;
    document.getElementById('movesScore').innerHTML = moves;
    document.getElementById('starScore').innerHTML = starCount;
    document.getElementById('timeScore').innerHTML = `${h}:${m}:${s}`;
    document.getElementById('modal').style.display = "block";
    document.getElementById('modalText').style.display = "block";
}

const updateMoves = (moves) => {
    const movesSpan = document.getElementById('moves');
    movesSpan.textContent = moves;
    if (moves === 10 || moves === 20 || moves === 30) {
        let stars = document.getElementsByClassName("stars")[0];
        stars.removeChild(stars.firstElementChild);
    }
}

const compareCards = () => {
    updateMoves(++moves);
    const card1 = openCards[0].firstElementChild.className;
    const card2 = openCards[1].firstElementChild.className;
    if (card1 === card2) {
        console.log('match');
        matches++;
        if (matches === 8) {
            let endTime = new Date(); 
            displayWinModal(startTime, endTime);
            startTime = null;
        }
    } else {
        openCards.map(flipCardDown);
    }
    openCards.length = 0;
}

const flipCardUp = (node) => {
    startTimer()
    //check if icon or card background was clicked
    if (node.path.length > 7) {
        node = node.path[1];
    } else {
        node = node.target;
    }
    //make sure face down cards clicked and only 2 cards max are face up
    if (node.className !== 'card open show' && openCards.length < 2) {
        node.classList.add("open", "show");
        openCards.push(node)
        if (openCards.length === 2) {
            setTimeout(compareCards, 1000);
        } 
    }
}

const flipCardDown = (node) => {
    node.classList.remove("open", "show");
    return node;
}

const shuffleCards = () => {
    let cardsObj = document.getElementsByClassName("card");
    let cards = [];
    // Transform HTMLCollection into Array of Nodes
    for (let card of cardsObj) {
        cards.push(flipCardDown(card));
    }
    let deck = document.getElementsByClassName("deck")[0];
    cards = shuffle(cards);
    //remove cards from deck
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    //add shuffled cards to deck
    for (let card of cards) {
        card.addEventListener('click', e => flipCardUp(e));
        deck.appendChild(card);
    }
}

const resetStars = () => {
    let stars = document.getElementsByClassName("stars")[0];
    stars.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
}

const resetGame = () => {
    shuffleCards();
    resetStars();
    openCards = [];
    updateMoves(moves = 0);
    matches = 0;
    startTime = null;
    document.getElementById('modal').style.display = "none";
    document.getElementById('modalText').style.display = "none";
}

const addResetListener = () => {
    let restart = document.getElementsByClassName("restart")[0];
    let playAgain = document.getElementById("playAgain");
    restart.addEventListener('click', resetGame);
    playAgain.addEventListener('click', resetGame);
}

shuffleCards();
addResetListener();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

