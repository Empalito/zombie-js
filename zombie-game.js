const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1500;
canvas.height = 800;

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed: 5,
  isShooting: false,
  bullets: [],
  direction: "right",
};

const zombies = [];
let score = 0;
let gameOver = false;

function spawnZombie() {
  const zombie = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: 2,
    isAlive: true,
  };
  zombies.push(zombie);
}

spawnZombie();

const keys = {};

document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.fillRect(player.x - 10, player.y - 10, 20, 20);

  for (const zombie of zombies) {
    if (zombie.isAlive) {
      ctx.fillStyle = "red";
      ctx.fillRect(zombie.x - 10, zombie.y - 10, 20, 20);
    }
  }

  for (const bullet of player.bullets) {
    ctx.fillStyle = "blue";
    ctx.fillRect(bullet.x - 5, bullet.y - 5, 10, 10);
  }

  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 10, 20);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
  }
}

function updatePlayer() {
  if (!gameOver) {
    if (keys["ArrowUp"]) {
      player.y -= player.speed;
      player.direction = "up";
    }
    if (keys["ArrowDown"]) {
      player.y += player.speed;
      player.direction = "down";
    }
    if (keys["ArrowLeft"]) {
      player.x -= player.speed;
      player.direction = "left";
    }
    if (keys["ArrowRight"]) {
      player.x += player.speed;
      player.direction = "right";
    }

    if (keys["Space"]) {
      if (!player.isShooting) {
        player.isShooting = true;
        player.bullets.push({ x: player.x, y: player.y, direction: player.direction });
      }
    } else {
      player.isShooting = false;
    }

    player.bullets = player.bullets.filter((bullet) => {
      if (bullet.direction === "up") {
        bullet.y -= 10;
      } else if (bullet.direction === "down") {
        bullet.y += 10;
      } else if (bullet.direction === "left") {
        bullet.x -= 10;
      } else if (bullet.direction === "right") {
        bullet.x += 10;
      }

      return bullet.x > 0 && bullet.x < canvas.width && bullet.y > 0 && bullet.y < canvas.height;
    });
  }
}

function updateZombies() {
  for (const zombie of zombies) {
    if (zombie.isAlive) {
      const dx = player.x - zombie.x;
      const dy = player.y - zombie.y;
      const angle = Math.atan2(dy, dx);
      zombie.x= zombie.x + Math.cos(angle) * zombie.speed;
      zombie.y = zombie.y + Math.sin(angle) * zombie.speed;
      for (const bullet of player.bullets) {
        const distX = Math.abs(bullet.x - zombie.x);
        const distY = Math.abs(bullet.y - zombie.y);
    
        if (distX < 15 && distY < 15) {
          zombie.isAlive = false;
          player.bullets.splice(player.bullets.indexOf(bullet), 1);
          score++;
          spawnZombie();
        }
      }
    
      const distX = Math.abs(player.x - zombie.x);
      const distY = Math.abs(player.y - zombie.y);
    
      if (distX < 15 && distY < 15) {
        gameOver = true;
      }
    }
    }
    }
    
    function gameLoop() {
    draw();
    updatePlayer();
    updateZombies();
    
    if (!gameOver) {
    requestAnimationFrame(gameLoop);
    }
    }
    
    gameLoop();