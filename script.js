const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

const retryButton = document.getElementById('retryButton');
const gameOverBox = document.querySelector('.game-over-box');
const gameOverText = document.getElementById('gameOverText');
const gameOverStatus = document.getElementById('gameOverStatus');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

let birdImage = new Image();
birdImage.src = 'https://i.postimg.cc/gkPyP0w7/bird.png'; // New bird image
let backgroundImg = new Image();
backgroundImg.src = 'https://i.postimg.cc/Vs9rnW67/bg.webp'; // New background image

let router = { x: 50, y: 300, width: 70, height: 56, gravity: 0.35, lift: -10, velocity: 0 }; // Bigger size for the bird
let obstacles = [];
let isGameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Function to start the game
function startGame() {
  startScreen.style.display = 'none';
  gameOverBox.style.display = 'none';
  retryButton.style.display = 'none';
  router.y = 300;
  router.velocity = 0;
  obstacles = [];
  score = 0;
  isGameOver = false;
  requestAnimationFrame(gameLoop);
  document.getElementById('gameContainer').style.display = 'block';
}

// Draw bird with larger size
function drawBird() {
  ctx.drawImage(birdImage, router.x, router.y, router.width, router.height);
}

// Create obstacles with black color and no yellow border
function createObstacle() {
  const gap = 250;
  const height = Math.floor(Math.random() * (canvas.height - gap));
  obstacles.push({ x: canvas.width, y: 0, width: 40, height: height });
  obstacles.push({ x: canvas.width, y: height + gap, width: 40, height: canvas.height - height - gap });
}

// Draw obstacles with gradient look and no yellow border
function drawObstacles() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#333');
  gradient.addColorStop(1, '#111');

  ctx.fillStyle = gradient;
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    obstacle.x -= 1.5;
  });

  if (obstacles.length && obstacles[0].x < -40) {
    obstacles.shift();
    obstacles.shift();
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
  }
}

// Draw score and high score
function drawScoreAndHighScore() {
  ctx.fillStyle = '#ffcc00';
  ctx.font = '12px "Press Start 2P"';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 20);
  ctx.fillText(`High Score: ${highScore}`, 10, 20);
}

// Check for collision
function checkCollision() {
  if (router.y + router.height >= canvas.height || router.y <= 0) {
    isGameOver = true;
  }
  obstacles.forEach(obstacle => {
    if (
      router.x + router.width > obstacle.x &&
      router.x < obstacle.x + obstacle.width &&
      router.y < obstacle.y + obstacle.height &&
      router.y + router.height > obstacle.y
    ) {
      isGameOver = true;
    }
  });
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  drawBird();
  drawObstacles();
  drawScoreAndHighScore();
  checkCollision();

  if (isGameOver) {
    gameOverText.innerText = 'Cudy Game';
    gameOverStatus.innerText = `Game Over - Score: ${score}`; // Show the current score after game over
    gameOverBox.style.display = 'block';
    retryButton.style.display = 'block';
    return;
  }

  router.velocity += router.gravity;
  router.y += router.velocity;

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 250) {
    createObstacle();
  }

  requestAnimationFrame(gameLoop);
}

// Make the bird jump
function flap() {
  if (!isGameOver) {
    router.velocity = router.lift;
  }
}

// Event listeners
canvas.addEventListener('click', flap);
retryButton.addEventListener('click', startGame);
startButton.addEventListener('click', startGame);

startGame();