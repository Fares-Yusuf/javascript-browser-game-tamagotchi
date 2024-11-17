/*-------------------------------- Constants --------------------------------*/
const boredomStatEl = document.getElementById('boredom-stat');
const hungerStatEl = document.getElementById('hunger-stat');
const sleepinessStatEl = document.getElementById('sleepiness-stat');
const playBtnEl = document.getElementById('play');
const feedBtnEl = document.getElementById('feed');
const sleepBtnEl = document.getElementById('sleep');
const gameMessageEl = document.getElementById('message');
const resetBtnEl = document.getElementById('restart');
const petImgEl = document.querySelector('img');
const modal = document.getElementById('pet-select-modal');
const petChoices = document.querySelectorAll('.pet-choice');
const timerEl = document.getElementById('timer');
const mainEl = document.querySelector('main');
const gameOverModal = document.getElementById('game-over');
const deadPetImgEl = document.getElementById('dead-pet');
/*---------------------------- Variables (state) ----------------------------*/
let state = {
    boredom: 0,
    hunger: 0,
    sleepiness: 0,
    timer: 0,
    gameOver: false
};

let selectedPet = null;
let gameLoop = new Audio("assets/GameLoop.mp3");
let eatSound = new Audio("assets/eat.mp3");
let sleepSound = new Audio("assets/yawn.mp3");
let playSound = new Audio("assets/play.mp3");
let gameOverSound = new Audio("assets/gameover.mp3");
let highscoreSound = new Audio("assets/highscore.mp3");
let timeOut = 1000;

/*------------------------ Cached Element References ------------------------*/
boredomStatEl.textContent = state.boredom;
hungerStatEl.textContent = state.hunger;
sleepinessStatEl.textContent = state.sleepiness;

/*-------------------------------- Functions --------------------------------*/

function init() {
    modal.classList.add('hidden');
    mainEl.classList.remove('hidden');
    timerEl.textContent = `Timer: 0s`;
    gameLoop.play();
    gameLoop.loop = true;

    // Start the recursive game loop
    gameLoopFunction();
}

function gameLoopFunction() {
    if (state.gameOver) return;

    runTime();

    // Call gameLoopFunction again with the updated timeout
    setTimeout(gameLoopFunction, timeOut);
}

function handleClickPlay() {
    if (state.boredom > 0) {
        playSound.pause();
        playSound.play();
        state.boredom -= 1;
        boredomStatEl.textContent = state.boredom;
        hungerStatEl.textContent = state.hunger;
        sleepinessStatEl.textContent = state.sleepiness;
    }
}

function handleClickFeed() {
    if (state.hunger > 0) {
        eatSound.pause();
        eatSound.play();
        state.hunger -= 1;
        boredomStatEl.textContent = state.boredom;
        hungerStatEl.textContent = state.hunger;
        sleepinessStatEl.textContent = state.sleepiness;
    }
}

function handleClickSleep() {
    if (state.sleepiness > 0) {
        sleepSound.pause();
        sleepSound.play();
        state.sleepiness -= 1;
        boredomStatEl.textContent = state.boredom;
        hungerStatEl.textContent = state.hunger;
        sleepinessStatEl.textContent = state.sleepiness;
    }
}

function handleClickReset() {
    state.boredom = 0;
    state.hunger = 0;
    state.sleepiness = 0;
    state.timer = 0;
    state.gameOver = false;
    timeOut = 1000;
    boredomStatEl.textContent = state.boredom;
    hungerStatEl.textContent = state.hunger;
    sleepinessStatEl.textContent = state.sleepiness;
    gameOverModal.classList.add('hidden');
    // give gamemessage and reset button the class hidden
    gameMessageEl.classList.add('hidden');
    resetBtnEl.classList.add('hidden');
    if (petImgEl.src.includes('alien')) {
        document.querySelector('img').src = './assets/alien-happy.png';
    } else if (petImgEl.src.includes('puppy')) {
        document.querySelector('img').src = './assets/puppy-happy.png';
    } else if (petImgEl.src.includes('rabbit')) {
        document.querySelector('img').src = './assets/rabbit-happy.png';
    }
    // show pet select modal
    modal.classList.remove('hidden');
}

function runTime() {
    if (state.gameOver) return;

    // Update stats based on random chance
    const random = Math.random();
    if (random < 0.33) state.boredom++;
    else if (random < 0.66) state.hunger++;
    else state.sleepiness++;

    // Update timer and display stats
    state.timer++;
    updateDisplayStats();

    // increase the speed of gameloop as a percentage of the timer
    gameLoop.playbackRate = 1.0 + (state.timer / 100);

    timeOut = Math.max(300, parseInt(timeOut * (1.0 - (state.timer / 500)))); // Prevent timeOut from dropping below 500ms
    console.log('TimeOut: ' + timeOut);

    // Check game over condition
    if (isGameOver()) {
        handleGameOver();
        return;
    }

    // Update pet appearance and button states
    updatePetAppearance();
    updateButtonStates();
}

function updateDisplayStats() {
    timerEl.textContent = `Timer: ${state.timer}s`;
    boredomStatEl.textContent = state.boredom;
    hungerStatEl.textContent = state.hunger;
    sleepinessStatEl.textContent = state.sleepiness;
}

function isGameOver() {
    return state.sleepiness >= 10 || state.hunger >= 10 || state.boredom >= 10;
}

function handleGameOver() {
    gameLoop.pause();
    state.gameOver = true;
    // Get current highscore from localStorage
    const currentHighscore = localStorage.getItem('highscore') || 0;

    // Update highscore if current timer is higher
    if (state.timer > currentHighscore) {
        localStorage.setItem('highscore', state.timer);
        gameMessageEl.textContent = `New Highscore! 🎉 Your pet survived for ${state.timer} seconds! 🏆`;
        highscoreSound.play();
    } else {
        gameMessageEl.textContent = `Game Over! Your pet survived for ${state.timer} seconds. Highscore: ${currentHighscore}s`;
        gameOverSound.play();
    }

    deadPetImgEl.src = `./assets/${selectedPet}-dead.png`;
    mainEl.classList.add('hidden');
    gameOverModal.classList.remove('hidden');
    resetBtnEl.classList.remove('hidden');
    gameMessageEl.classList.remove('hidden');
}

function updatePetAppearance() {
    const status = (state.sleepiness >= 5 || state.hunger >= 5 || state.boredom >= 5) ? 'sad' : 'happy';
    petImgEl.src = `./assets/${selectedPet}-${status}.png`;
}

function updateButtonStates() {
    const updateButton = (button, stat) => {
        const critical = stat >= 5;
        button.style.backgroundColor = critical ? 'red' : 'deepskyblue';
        button.style.color = critical ? 'black' : 'white';
    };

    updateButton(sleepBtnEl, state.sleepiness);
    updateButton(feedBtnEl, state.hunger);
    updateButton(playBtnEl, state.boredom);
}
/*----------------------------- Event Listeners -----------------------------*/
playBtnEl.addEventListener('click', handleClickPlay);
feedBtnEl.addEventListener('click', handleClickFeed);
sleepBtnEl.addEventListener('click', handleClickSleep);
resetBtnEl.addEventListener('click', handleClickReset);
petChoices.forEach(choice => {
    choice.addEventListener('click', () => {
        // Remove selected class from all choices
        petChoices.forEach(c => c.classList.remove('selected'));
        // Add selected class to clicked choice
        choice.classList.add('selected');
        selectedPet = choice.dataset.pet;

        // Update the main game pet image
        petImgEl.src = `./assets/${selectedPet}-happy.png`;
        init();
    })
});