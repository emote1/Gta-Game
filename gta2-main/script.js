
import { Player } from "./player.js";
import { Projectile } from "./projectile.js";
import { Enemy } from "./enemy.js";
import { distanceBetweenTwoPoints } from "./utilities.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const scoreEl = document.querySelector('#total-score');
const coinsScoreEl = document.querySelector('#coins-score');
const enemiesScoreEl = document.querySelector('#enemies-score');
const wastedElement = document.querySelector('.wasted');

let coins = [];
let player;
let projectiles = [];
let enemies = [];
let particles = [];
let animationId;
let countIntervalId;
let spawnIntervalId;
let scoreFromEnemies = 0;
let scoreFromCoins = 0;

document.addEventListener('DOMContentLoaded', () => {
  const restartButton = document.getElementById("restartButton");
  if (restartButton) {
      restartButton.addEventListener("click", restartGame);
  }
  startGame();
});


function startGame() {
  init();
  animate();
  spawnEnemies();
   

}

// Скрываем кнопку перезапуска
document.getElementById("restartButton").addEventListener("click", restartGame);
function init() {
  const movementLimits = {
    minX: 0,
    maxX: canvas.width,
    minY: 0,
    maxY: canvas.height,
  };
  player = new Player(canvas.width / 2, canvas.height / 2, context, movementLimits);
  const scoreWrap = document.querySelector('.score-wrap');
  


  let coinIcon = document.getElementById("coinIcon");
  if (!coinIcon) {
    // Если элемент не найден, создаем новый
    coinIcon = new Image();
    coinIcon.id = "coinIcon";
    coinIcon.src = "img/reefIcon.jpg";
    coinIcon.alt = "Coin";
    coinIcon.classList.add("coin-icon");
    const scoreWrap = document.querySelector('.score-wrap');
    scoreWrap.insertBefore(coinIcon, scoreWrap.firstChild);
  } else {
    // Если элемент найден, обновляем его свойства, если это необходимо
    coinIcon.src = "img/reefIcon.jpg"; // Пример обновления свойства
  }
  // Добавляем обработчик события на клик для создания снарядов
  addEventListener("click", createProjectile);
}

function createProjectile(event) {
  projectiles.push(
    new Projectile(
      player.x,
      player.y,
      event.clientX,
      event.clientY,
      context
    )
  );
};

function spawnEnemies() {
  let countOfSpawnEnemies = 1;

  countIntervalId = setInterval(() => countOfSpawnEnemies++, 30000);
  spawnIntervalId = setInterval(() => spawnCountEnemies(countOfSpawnEnemies), 1000);

  spawnCountEnemies(countOfSpawnEnemies)
}

function spawnCountEnemies(count) {
  
  for (let i = 0; i < count; i++) {
    enemies.push(new Enemy(canvas.width, canvas.height, context, player));
  }
}

function animate() {
  animationId = requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Обновление частиц

  particles = particles.filter(particle => particle.alpha > 0);
  particles.forEach(particle => particle.update());
    // Обновление снарядов
  projectiles = projectiles.filter(projectileInsideWindow);
  projectiles.forEach(projectile => projectile.update());
// Обновление врагов и проверка столкновений
enemies.forEach(enemy => {
  enemy.update(); // Теперь здесь вызывается метод update для каждого врага
  checkHittingEnemy(enemy);
});
enemies = enemies.filter(enemy => enemy.health > 0);

  
  // Обновление монет и проверка на сбор
  coins.forEach((coin, index) => coin.update());
  coins = coins.filter(coin => checkCoinCollection(player, coin) === false);

  // Обновление игрока
  player.update();
  function showGameOver() {
    document.getElementById("gameOverContainer").style.display = "block";
    document.getElementById("restartButton").style.display = "block"; // Убедитесь, что кнопка видима
    // Установить обработчик события click только один раз, если он ещё не установлен
    document.getElementById("restartButton").onclick = restartGame;

    // Здесь также можете обновить итоговый счет и выполнить другие необходимые действия
  }
  function updateTotalScore() {
    const totalScore = scoreFromEnemies + scoreFromCoins;
    document.getElementById("live-total-score").textContent = totalScore; // Обновляем счёт во время игры
  }
  // Проверка на проигрыш
  const isGameOver = enemies.some(checkHittingPlayer);
  if (isGameOver) {
    document.getElementById("total-score").textContent = scoreFromEnemies + scoreFromCoins; // Обновление финального счёта
    document.getElementById("gameOverContainer").style.display = "block"; // Показ контейнера завершения игры
    showGameOver();

    clearInterval(countIntervalId);
    clearInterval(spawnIntervalId);
    cancelAnimationFrame(animationId);
   
  }
}
function restartGame() {
  // Скрываем изображение "Wasted"

  document.getElementById("gameOverContainer").style.display = "none";
  resetGame();
}
  function resetGame() {  // Сбрасываем игровые переменные
  coins = [];
  projectiles = [];
  enemies = [];
  particles = [];
  scoreFromEnemies = 0;
  scoreFromCoins = 0;

  
  
  // Сбрасываем счетчики на интерфейсе
  coinsScoreEl.textContent = '0';
  enemiesScoreEl.textContent = '0';
  scoreEl.textContent = '0'; // Сброс общего счета
  updateTotalScore()
  // Возобновляем игровой цикл
  cancelAnimationFrame(animationId); // Важно отменить текущий цикл анимации, если он активен
  
  // Скрываем кнопку перезапуска
  document.getElementById("restartButton").style.display = "none";
  startGame(); // Перезапускаем игру

}

function checkCoinCollection(player, coin) {
  // Реализуйте логику проверки сбора монеты игроком
  const distance = distanceBetweenTwoPoints(player.x, player.y, coin.x, coin.y);
  if (distance < player.radius + coin.radius) {
    // Монета собрана
    increaseScoreByCoin(100);
    return true; // Возвращает true, если монета собрана
  }
  return false; // Возвращает false, если монета не собрана
}
function increaseScoreByCoin(amount = 100) {
  scoreFromCoins += amount;
  coinsScoreEl.innerText = scoreFromCoins; // Обновление счета монет
  updateTotalScore();
}
function updateTotalScore() {
  const totalScore = scoreFromEnemies + scoreFromCoins;
  document.getElementById("live-total-score").textContent = totalScore; // Убедитесь, что ID соответствует вашему HTML
}

  particles.forEach(particle => particle.update());
  projectiles.forEach(projectile => projectile.update());
  player.update();
  enemies.forEach(enemy => enemy.update());


function projectileInsideWindow(projectile) {
  return projectile.x + projectile.radius > 0 &&
    projectile.x - projectile.radius < canvas.width &&
    projectile.y + projectile.radius > 0 &&
    projectile.y - projectile.radius < canvas.height
}

function checkHittingPlayer(enemy) {
  const distance = distanceBetweenTwoPoints(player.x, player.y, enemy.x, enemy.y);
  return distance - enemy.radius - player.radius < 0;
}

function checkHittingEnemy(enemy) {
  projectiles.some((projectile, index) => {
    const distance = distanceBetweenTwoPoints(projectile.x, projectile.y, enemy.x, enemy.y);
    if (distance - enemy.radius - projectile.radius > 0) return false;

    removeProjectileByIndex(index);
    enemy.health--;

    if (enemy.health < 1) {
      increaseScoreFromEnemies(250); // Правильно
      enemy.createExplosion(particles);
      enemy.createCoins(coins, Math.floor(Math.random() * 3) + 1);
    }
      // Создать от 1 до 3 монет
     
      
    return true;
  });
}

function removeProjectileByIndex(index) {
  projectiles.splice(index, 1);
}

function increaseScoreFromEnemies(amount = 250) {
  scoreFromEnemies += amount;
  enemiesScoreEl.innerText = scoreFromEnemies; // Обновление счета за убийство врагов
  updateTotalScore();
}