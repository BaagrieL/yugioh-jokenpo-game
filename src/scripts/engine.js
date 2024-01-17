const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },

    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },

    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#computer-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#player-cards"),
    },

    actions: {
        button: document.getElementById("next-duel"),
    }
}

pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }


    return cardImage;
}


async function setCardsField (cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await  updateScoreBasedOnScreenSize();
    await drawButton(duelResults);
}

async function drawCardsInField (cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function drawButton (text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function checkDuelResults (playerCardId, computercardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computercardId)){
        duelResults = "win";
        state.score.playerScore++;

        
    } else if (playerCard.LoseOf.includes(computercardId)) {
        duelResults = "lose";
        state.score.computerScore++;
       
    }

    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages () {
    let { computerBox, player1Box } = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove())

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove())
}

async function drawSelectedCard (index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute :" + cardData[index].type;
}


async function drawCards (cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);


        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel () {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    await showHiddenCardFieldsImages(false);

    await hiddenCardDetail();

    init();
}

async function showHiddenCardFieldsImages (value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    } else {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetail () {
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function playAudio (status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

try {
    audio.play();
} catch {

}
    
}


async function updateScoreBasedOnScreenSize () {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 500) {
        state.score.scoreBox.innerText = `Win\n ${state.score.playerScore}\nLose\n ${state.score.computerScore}` ;
    } else if (screenWidth > 500 && screenWidth <= 987) {
        state.score.scoreBox.innerText = `Win: ${state.score.playerScore} \n Lose: ${state.score.computerScore}`;
    } else if (screenWidth > 987) {
        state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
    }



    window.addEventListener('resize', updateScoreBasedOnScreenSize);
}

async function bgm () {
    const bgm = document.getElementById("bgm");
    bgm.volume = 0.5;
    bgm.play();
}

async function startGame () {
    const startContainer = document.querySelector(".start__container");
    const startButton = document.querySelector(".start__container button");
    const main = document.querySelector("main");


    startButton.addEventListener("click", () => {
        startContainer.style.display = "none";
        main.style.display = "flex";
    });
        
    
    
}

function init () {
    showHiddenCardFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
    updateScoreBasedOnScreenSize();

    bgm();

    startGame();
    
}

init();



