/*-------------------------------- Constants --------------------------------*/
const boredomStatEl = document.getElementById('boredom-stat');
const hungerStatEl = document.getElementById('hunger-stat');
const sleepinessStatEl = document.getElementById('sleepiness-stat');
const playBtnEl = document.getElementById('play');
const feedBtnEl = document.getElementById('feed');
const sleepBtnEl = document.getElementById('sleep');
const gameMessageEl = document.getElementById('message');
const resetBtnEl = document.getElementById('restart');
/*---------------------------- Variables (state) ----------------------------*/
let state = {
    boredom: 0,
    hunger: 0,
    sleepiness: 0,
    timer: 0,
    gameOver: false
};


/*------------------------ Cached Element References ------------------------*/
boredomStatEl.textContent = state.boredom;
hungerStatEl.textContent = state.hunger;
sleepinessStatEl.textContent = state.sleepiness;

/*-------------------------------- Functions --------------------------------*/

function handleClickPlay() {
    if (state.boredom > 0) {
        state.boredom -= 1;
        boredomStatEl.textContent = state.boredom;
        hungerStatEl.textContent = state.hunger;
        sleepinessStatEl.textContent = state.sleepiness;
        gameMessageEl.textContent = 'You played with your pet!';
        if (state.boredom >= 10 || state.hunger >= 10 || state.sleepiness >= 10) {
            gameMessageEl.textContent = 'Your pet has died!';
            state.gameOver = true;
        }
    }
}

function handleClickFeed() {
    if (state.hunger > 0) {
        state.hunger -= 1;
        boredomStatEl.textContent = state.boredom;
        hungerStatEl.textContent = state.hunger;
        sleepinessStatEl.textContent = state.sleepiness;
        gameMessageEl.textContent = 'You fed your pet!';
        if (state.boredom >= 10 || state.hunger >= 10 || state.sleepiness >= 10) {
            gameMessageEl.textContent = 'Your pet has died!';
            state.gameOver = true;
        }
    }
}

function handleClickSleep() {
    if (state.sleepiness > 0) {
        state.sleepiness -= 1;
        boredomStatEl.textContent = state.boredom;
        hungerStatEl.textContent = state.hunger;
        sleepinessStatEl.textContent = state.sleepiness;
        gameMessageEl.textContent = 'You put your pet to bed!';
        if (state.boredom >= 10 || state.hunger >= 10 || state.sleepiness >= 10) {
            gameMessageEl.textContent = 'Your pet has died!';
            state.gameOver = true;
        }
    }
}

function handleClickReset() {
    state.boredom = 0;
    state.hunger = 0;
    state.sleepiness = 0;
    state.timer = 0;
    state.gameOver = false;
    boredomStatEl.textContent = state.boredom;
    hungerStatEl.textContent = state.hunger;
    sleepinessStatEl.textContent = state.sleepiness;
    gameMessageEl.textContent = 'Your pet has been born!';
}

function runTime() {
    if (state.gameOver) {
        return;
    }
    // randomly increase boredom or hunger or sleepiness by one
    const random = Math.random();
    console.log(random);
    if (random < 0.33) {
        state.boredom++;
    } else if (random < 0.66) {
        state.hunger++;
    } else {
        state.sleepiness++;
    }
    state.timer++;
    boredomStatEl.textContent = state.boredom;
    hungerStatEl.textContent = state.hunger;
    sleepinessStatEl.textContent = state.sleepiness;
    if (state.sleepiness >= 10 || state.hunger >= 10 || state.boredom >= 10) {
        state.gameOver = true;
        console.log(`You have survived for ${state.timer} seconds!`);
        // change the src of pet image img element
        document.querySelector('img').src = './assets/alien-dead.png';
        return;
    } else if (state.sleepiness >= 5 || state.hunger >= 5 || state.boredom >= 5){
        document.querySelector('img').src = './assets/alien-sad.png';
    } else {
        document.querySelector('img').src = './assets/alien-happy.png';
    }
}
/*----------------------------- Event Listeners -----------------------------*/
playBtnEl.addEventListener('click', handleClickPlay);
feedBtnEl.addEventListener('click', handleClickFeed);
sleepBtnEl.addEventListener('click', handleClickSleep);
resetBtnEl.addEventListener('click', handleClickReset);

/*----------------------------- Runtime Code -----------------------------*/

const timer = setInterval(() => {
    if (state.gameOver) {
        clearInterval(timer)
        return
    }
    runTime()
}, 1000)