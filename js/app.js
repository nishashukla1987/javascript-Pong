
const gameFinishedMsg = document.getElementsByClassName("game-finished-msg");
const gameInstruction = document.getElementsByClassName("game-instruction");
const gameIntro       = document.getElementById("game-intro");
const startBtn        = document.getElementById("start-btn");
const gameContainer   = document.getElementById("container");
const extra           = document.getElementById("extra");

const bgm             = document.getElementById("bgm");
const pop             = document.getElementById("pop");
const ding            = document.getElementById("ding");
const win             = document.getElementById("yeah");

//------------------scores------------------------------------------

const Player1 = document.querySelector("#playerA");
const Player2 = document.querySelector("#playerB");

let scoreA = 0, scoreB = 0;

//---------------ball  movement---------------------------------

const       ball = container.querySelector("#ball");
const ballRadius = 10; // TODO: ball.offsetHeight / 2;

let x = 500, y = 300, movementX = 5, movementY = 5;

//------------------paddles-----------------------------------------

const  paddle1 = document.querySelector("#paddle1");
let  position1 = container.offsetHeight / 2;
let direction1 = 0; // -1 up : 0 neutral : 1 down

const  paddle2 = document.querySelector("#paddle2");
let  position2 = container.offsetHeight / 2;
let direction2 = 0; // -1 up : 0 neutral : 1 down

const     paddleGlobal = [paddle1, paddle2];
const halfPaddleHeight = 70; // TODO: paddle1.offsetHeight / 2;

//---------------start game-------------------------------------

startBtn.addEventListener("click", startGame);

function startGame() {
  bgm.play();
  bgm.volume = 0.3;
  gameIntro.style.display = "none";
  gameContainer.style.display = "block";
  extra.style.display = "block";
  setInterval(move, 1000 / 60);
}

//---------------simulation-------------------------------------

function move() {
  // constrain paddles on y axis
  const upBoundary = 10;
  const downBoundary = container.offsetHeight - 150;

  if (direction1 !== 0) {
    position1 += direction1 * 10;
    position1 = Math.max(upBoundary, Math.min(downBoundary, position1));
    paddle1.style.top = position1 + "px";
  }

  if (direction2 !== 0) {
    position2 += direction2 * 10;
    position2 = Math.max(upBoundary, Math.min(downBoundary, position2));
    paddle2.style.top = position2 + "px";
  }

  // reflect ball on upper and lower wall
  if ( y >= container.offsetHeight - 20 || y <= 0 ) {
    movementY *= -1;
  }

  // detect goals / scores
  if ( x >= container.offsetWidth ) scoreForB();
  if ( x <= 0                     ) scoreForA();

  paddleGlobal.forEach( (p) => {
    // check for collison of ball with each paddle
    const collides = ballCollidesWithPaddle(
      p.offsetLeft,
      p.offsetTop,
      p.offsetWidth,
      p.offsetHeight
    );

    if (collides) {
      pop.play();         // sound effect
      movementX *= 1.05;  // accelerate ball by 5%

      // calculate refelction on the y-axis
      const ballCenterY      = ballRadius + y;
      const paddleCenterY    = halfPaddleHeight + p.offsetTop;
      const distanceY        = Math.abs( ballCenterY - paddleCenterY );
      const reflectionFactor = -2 * ( distanceY / halfPaddleHeight ) + 1;
      movementY             += reflectionFactor;

      if (p === paddle1) {
        movementX = Math.abs(movementX);
      } else {
        movementX = Math.abs(movementX) * -1;
      }
    }
  });

  y += movementY;
  x += movementX;
  ball.style.top = `${y}px`;
  ball.style.left = `${x}px`;
}

function ballCollidesWithPaddle(left, top, width, height) {
  return (
    x > left - 20 &&
    x < left + width && // right
    y > top - 20 &&
    y < top + height // bottom
  );
}

//--------------SCORES-----------------------------------------------------

function scoreForB() {
  if (scoreA < 5) {
    scoreA++;
    ding.play();  // sound effect with paddles and boundaries
    Player1.innerText = scoreA;
  }
  resetBall();
}

function scoreForA() {
  if (scoreB < 5) {
    scoreB++;
    ding.play(); // sound effect with paddles and boundaries
    Player2.innerText = scoreB;
  }
  resetBall();
}

//-------------------------reset function----------

function resetBall() {
  x = container.offsetWidth / 2;
  y = container.offsetHeight / 2;

  if (scoreA === 5 || scoreB === 5) {
    movementX = 0;
    movementY = 0;
    bgm.pause();
    win.play();
    ball.style.display = "none";
    gameInstruction[0].style.display = "none";
    gameInstruction[1].style.display = "none";
    if (scoreA === 5) {
      gameFinishedMsg[0].style.display = "block";
    } else {
      gameFinishedMsg[1].style.display = "block";
    }
  } else {
    movementY = (3 + Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
    movementX = (3 + Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1);
  }
}

//---------------event handlers---------------------------------

document.onkeydown = (event) => {
  switch (event.code) {
    // pladdle1
    case "KeyW":
      direction1 = -1;
      break;
    case "KeyS":
      direction1 = 1;
      break;
    // pladdle2
    case "ArrowUp":
      direction2 = -1;
      break;
    case "ArrowDown":
      direction2 = 1;
      break;
  }
};

document.onkeyup = (event) => {
  switch (event.code) {
    // pladdle1
    case "ArrowUp":
      if (direction2 == -1) direction2 = 0;
      break;
    case "ArrowDown":
      if (direction2 == 1) direction2 = 0;
      break;
    // pladdle2
    case "KeyW":
      if (direction1 == -1) direction1 = 0;
      break;
    case "KeyS":
      if (direction1 == 1) direction1 = 0;
      break;
  }
};