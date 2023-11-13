sound = new Audio("./audio/switch_sound.mp3");
sound.volume = 0.3;
sound.play();
const urlSearch = window.location.search;
const urlParams = new URLSearchParams(urlSearch);
document.getElementById("username").innerHTML = `${urlParams.get("username")}:`;

const target = document.getElementById("target");
const userScore = document.getElementById("userScore");
const houseScore = document.getElementById("houseScore");
const gameArea = document.getElementById("gameArea");
const timer = document.getElementById("timer");
const infoText = document.getElementById("countdown");
let clicked = false;
let paused = false;
let reactionTimeStart = 0;
let reactionTimeEnd = 0;
let reactionTime = 0;

let userMetaScore = 0;
let houseMetaScore = 0;

function randomColor() {
  target.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

let round = 1;
function countDown(round) {
  reactionTime = 0;
  document.getElementById("round").innerHTML = `Round : ${round}`;
  paused = true;
  infoText.style.display = "flex";
  infoText.innerHTML = `<p>Round : ${round}<p>`;
  setTimeout(() => {
    infoText.innerHTML = "<p>3</p>";
    new Audio("./audio/countdown_1.mp3").play();
  }, 2000);
  setTimeout(() => {
    infoText.innerHTML = "<p>2</p>";
    new Audio("./audio/countdown_2.mp3").play();
  }, 3000);
  setTimeout(() => {
    infoText.innerHTML = "<p>1</p>";
    new Audio("./audio/countdown_3.mp3").play();
  }, 4000);
  setTimeout(() => {
    infoText.innerHTML = "<p>GO!</p>";
    new Audio("./audio/countdown_4.mp3").play();
  }, 5000);
  setTimeout(() => {
    infoText.style.display = "none";
    infoText.innerHTML = "Ready?";
    requestAnimationFrame(gameLoop);
  }, 5200);
}

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function moveTarget() {
  paused = false;
  target.style.border = "3px solid black";
  target.style.display = "block";
  target.style.left = `${random(50, gameArea.clientWidth - 100)}px`;
  target.style.top = `${random(
    gameArea.offsetTop + 50,
    gameArea.clientHeight + gameArea.offsetTop - 50
  )}px`;
  randomColor();
  reactionTimeStart = performance.now();
}

function score(party) {
  if (clicked === true || paused) {
    return;
  }
  if (party === "user") {
    reactionTimeEnd = performance.now();
    reactionTime += reactionTimeStart - reactionTimeEnd;
    target.style.border = "3px solid green";
    userScore.innerHTML++;
    clicked = true;
    new Audio("./audio/target_hit_sound.mp3").play();
  } else {
    houseScore.innerHTML++;
    sound = new Audio("./audio/target_miss_sound.mp3");
    sound.volume = 0.2;
    sound.play();
  }
}

userMetaScoreLabel = document.getElementById("userMeta");
houseMetaScoreLabel = document.getElementById("houseMeta");

function endSequence() {
  paused = true;
  target.style.display = "none";
  if (Number(userScore.innerHTML) === Number(houseScore.innerHTML)) {
    infoText.innerHTML = "<p>Tie!</p><button onClick='resetScore()'>Next round</button>";
  }
  if (Number(userScore.innerHTML) > Number(houseScore.innerHTML)) {
    infoText.innerHTML = `<p>${urlParams.get(
      "username"
    )} wins!</p><label>Average reaction time : ${Math.abs(
      reactionTime / roundCountTotal
    ).toFixed(0)}ms</label><button onClick="resetScore()">Next round</button>`;
    userMetaScore++;
    userMetaScoreLabel.innerHTML = `${userMetaScore}`;
  }
  if (Number(userScore.innerHTML) < Number(houseScore.innerHTML)) {
    infoText.innerHTML = `<p>House wins!</p><button onClick="resetScore()">Next round</button>`;
    houseMetaScore++;
    houseMetaScoreLabel.innerHTML = `${houseMetaScore}`;
  }
  if (roundCount === 0) {
    return gameOver();
  }
  infoText.style.display = "flex";
}

function resetScore() {
  userScore.innerHTML = 0;
  houseScore.innerHTML = 0;
  round++;
  roundTime = 30;
  roundCount--;
  setTimeout(() => {
    countDown(round);
  }, 100);
}

function gameOver() {
  if (Number(userMetaScore) === Number(houseMetaScore)) {
    infoText.innerHTML = `<p style="font-size:3em;text-wrap:wrap !important;">Game ended in a tie!<p>`;
  } else {
    if (Number(userMetaScore) > Number(houseMetaScore)) {
      infoText.innerHTML = `<p style="font-size:3em;text-wrap:wrap !important;">${urlParams.get(
        "username"
      )} is the game winner! :)</p><label>Winner winner chicken dinner</label><a style="font-size:2em;margin-top:50px;" href='./index.html'>Go back</a>`;
    } else {
      infoText.innerHTML = `<p style="font-size:3em;text-wrap:wrap !important;" >House is the game winner! :( </p><label>The house always wins<label><a href='./index.html'>Go back</a>`;
    }
  }
  infoText.style.display = "flex";
}

let delta;
switch (urlParams.get("difficulty")) {
  case "1":
    delta = 1500;
    break;
  case "2":
    delta = 1250;
    break;
  case "3":
    delta = 1000;
    break;
  case "4":
    delta = 750;
    break;
  case "5":
    delta = 500;
    break;
}

let roundCount = 10;
let oldTime = 0;
let roundTime = 30;
let roundCountTotal = Number([roundTime].join(""));
function gameLoop(currentTime) {
  if (roundTime === -1) {
    return endSequence();
  }
  if (oldTime === 0) {
    oldTime = currentTime;
  }
  if (currentTime - oldTime >= delta) {
    if (clicked === false) {
      score("house");
    }
    timer.innerHTML = roundTime;
    clicked = false;
    moveTarget();
    roundTime--;
    oldTime = currentTime;
  }
  window.requestAnimationFrame(gameLoop);
}

countDown(round);

target.addEventListener("click", (e) => {
  e.stopPropagation();
  score("user");
});
gameArea.addEventListener("click", (e) => score("house"));
