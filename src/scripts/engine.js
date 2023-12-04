const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#timeLeft"),
    score: document.querySelector("#score"),
  },
  values: {
    hitPosition: 0,
    result: 0,
    currentTime: 60,
  },
  actions: {
    countDownTimerId: setInterval(countDown, 1000),
    timerId: setInterval(randomSquare, 1000),
  },
};

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime === 0) {
    clearInterval(state.actions.countDownTimerId);
    alert("Game Over");
  }
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });
  let ramdomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[ramdomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id == state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result * 100;
        state.values.hitPosition = null;
        playSound("hit.mp4");
      }
    });
  });
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}`);
  audio.volume = 0.2;
  audio.play();
}

function initialize() {
  addListenerHitBox();
}

initialize();
