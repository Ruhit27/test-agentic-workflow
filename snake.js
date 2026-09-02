const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('snake-overlay');

const CELL = 20;
const COLS = canvas.width / CELL;
const ROWS = canvas.height / CELL;
const LIGHT = '#9bbc0f';
const DARK = '#0f380f';
const TICK_MS = 130;

let snake, direction, nextDirection, food, score, running, gameOver, timer;

function resetState() {
  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = direction;
  score = 0;
  running = false;
  gameOver = false;
  scoreEl.textContent = score;
  placeFood();
  draw();
  showOverlay('Press an arrow key to start');
}

function placeFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  food = pos;
}

function showOverlay(text) {
  overlay.querySelector('p').textContent = text;
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

function draw() {
  ctx.fillStyle = LIGHT;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = DARK;
  ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL);

  for (const segment of snake) {
    ctx.fillRect(segment.x * CELL + 1, segment.y * CELL + 1, CELL - 2, CELL - 2);
  }
}

function tick() {
  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
  const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);

  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    scoreEl.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function startGame() {
  running = true;
  gameOver = false;
  hideOverlay();
  clearInterval(timer);
  timer = setInterval(tick, TICK_MS);
}

function endGame() {
  running = false;
  gameOver = true;
  clearInterval(timer);
  showOverlay(`Game over! Score: ${score} — press space to restart`);
}

function setDirection(x, y) {
  if (direction.x === -x && direction.y === -y) return;
  nextDirection = { x, y };
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      if (!running && !gameOver) startGame();
      setDirection(0, -1);
      break;
    case 'ArrowDown':
      e.preventDefault();
      if (!running && !gameOver) startGame();
      setDirection(0, 1);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      if (!running && !gameOver) startGame();
      setDirection(-1, 0);
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (!running && !gameOver) startGame();
      setDirection(1, 0);
      break;
    case ' ':
      e.preventDefault();
      if (gameOver) resetState();
      break;
  }
});

resetState();
