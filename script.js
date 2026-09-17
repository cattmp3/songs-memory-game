const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;


//put together the cards that are supposed to match
const pairNames = [...new Set(
    [...cards].map(card => card.dataset.framework)
)];

let selectedPairs
let selectedCards

//function only created so when game resets it chooses new cards once again
function choosingCards() {
    //shuffle all pairs 
    pairNames.sort(() => Math.random() - 0.5);
    
    //randomly select 12 pairs  
    selectedPairs = pairNames.slice(0, 12);
    
    //the cards selected are the previously selected pairs
    selectedCards = [...cards].filter(card => selectedPairs.includes(card.dataset.framework));
    
    //show only the selected cards and hide the rest
    cards.forEach(card => {
        if (selectedCards.includes(card)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

choosingCards() //calling function

//window.alert('if your first card contains \"music\" let it play before you click on a second card');

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    
    this.classList.add('flip'); // "this" represents the card that was clicked

    //first card
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        //play audio if the card owns one
        if (this.dataset.audio) {
            if (!this.audio) {
                this.audio = new Audio(this.dataset.audio);
            }

            this.audio.currentTime = 0;
            this.audio.play()
        }

        return;
    }

    //second card
    secondCard = this
    
    //play audio if the card owns one
        if (this.dataset.audio) {
            if (!this.audio) {
                this.audio = new Audio(this.dataset.audio);
            }

            this.audio.currentTime = 0;
            this.audio.play()
        }
        
        checkForMatch();
}

//to stop a cards audio
function stopAudio(card) {
    if (card && card.audio) {
        card.audio.pause();
        card.audio.currentTime = 0;
    }
}

const restartButton = document.getElementById('restart'); //a button to restart the game after finished

let matchedPairs = 0

//if the cards do belong together they will not turn back
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();

    if (isMatch) {
        matchedPairs++;

        //when the game is finished the 'play again' button will show
        if (matchedPairs === 12) {
            restartButton.style.display = 'block'
            gameWon(); //confettissss

         };
    };
};

function restartGame() {
    matchedPairs = 0;

    //by removing the flip the cards flip back
    cards.forEach(card => {
        card.classList.remove('flip')
    }); 

    resetBoard()
    
    choosingCards()

    shuffle() 

    //this is needed to give back the flipping motion previously removed
    cards.forEach(card => {
        card.addEventListener("click", flipCard)
    }); 

    restartButton.style.display = 'none' //makes the button disappear again

}

//click the button and the game will restart (calling the function restartGame)
restartButton.addEventListener('click', restartGame);

//if the cards match audio will stop and cards will not turn back
function disableCards() {
    //no way of knowing which card has audio so both need to be disabled
    stopAudio(firstCard);
    stopAudio(secondCard);

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

//if cards do not match audios need to be stopped and cards will turn back
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        stopAudio(firstCard);
        stopAudio(secondCard);

        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 2500);
}

//resets board by reseting the variables to starting declarations
function resetBoard(){
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

//shuffles the cards placement on the board
function shuffle() {
    selectedCards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 24);
        card.style.order = randomPos;
    });
}; 

//calls the shuffle function
shuffle()

//allows every card to flip when clicked (when clicked it calls the flipCard function)
selectedCards.forEach(card => {
    card.addEventListener('click', flipCard);
});

