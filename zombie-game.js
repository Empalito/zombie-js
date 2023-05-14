const button = document.getElementById("button");

const audio = new Audio ('01.Forever Bound - Stereo Madness.mp3');

window.addEventListener('load', function() {


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function playAudio () {
  audio.volume = 0.2; // Set the volume to 50%
  audio.play();
}

document.addEventListener("keydown", (e) => {
  if (e) {
    playAudio()
  }
})


const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed: 6,
  isShooting: false,
  bullets: [],
  direction: "right",
};

const zombies = [];
let score = 0;
let gameOver = false;
let aliveZombies = 0;

function spawnZombie() {
  if (aliveZombies === 0) {
    switch (true) {
      case score < 10:
        zombies.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 2,
          isAlive: true,
          health: 1,
        });
        aliveZombies++;
        break;
      case score >= 10 && score < 20:
        for (let i = 0; i < 2; i++) {
          zombies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 2,
            isAlive: true,
            health: 2,
          });
          aliveZombies++;
        }
        break;
      case score >= 20 && score < 30:
        for (let i = 0; i < 3; i++) {
          zombies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 3,
            isAlive: true,
            health: 3,
          });
          aliveZombies++;
        }
        break;
      case score >= 32 && score < 50:
        for (let i = 0; i<7; i++) {
          zombies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed:5,
            isAlive: true,
            health: 4,
          });
          aliveZombies++;
        }
        break;
      default:
        zombies.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: 2,
          isAlive: true,
          health: 2,
        });
        aliveZombies++;
        break;
    }
  }
}

spawnZombie();

const keys = {};

document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.code] = false;

});

const images = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image(),
};

images.up.src='ShooterUp.png'
images.down.src='ShooterDown.png'
images.right.src='ShooterRight.png'
images.left.src='ShooterLeft.png'

const zombieImage = new Image ();
zombieImage.src = 'zombie.png';

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (player.direction) {
    case 'up':
      ctx.drawImage(images.up, player.x - 10, player.y - 10, 40, 40);
      break;
    case 'down':
      ctx.drawImage(images.down, player.x - 10, player.y - 10, 40, 40);
      break;
    case 'left':
      ctx.drawImage(images.left, player.x - 10, player.y - 10, 40, 40);
      break;
    case 'right':
      ctx.drawImage(images.right, player.x - 10, player.y - 10, 40, 40);
      break;
  }
  for (const zombie of zombies) {
    if (zombie.isAlive) {
      ctx.drawImage(zombieImage, zombie.x - zombieImage.width / 5, zombie.y - zombieImage.height / 5, zombieImage.width / 2, zombieImage.height / 2);    
      drawHealthBar(zombie);
    }
  }

  for (const bullet of player.bullets) {
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x - 5, bullet.y - 5, 10, 10);
  }

  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 10, 20, );
}

function drawHealthBar(zombie) {
  const healthBarWidth = 30;
  const healthBarHeight = 5;
  const healthBarX = zombie.x - healthBarWidth / 2;
  const healthBarY = zombie.y - 30;
  const currentHealthWidth = (healthBarWidth / 2) * zombie.health;

  ctx.fillStyle = "black";
  ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

  ctx.fillStyle = "red";
  ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
}

function updatePlayer() {
  if (!gameOver) {
    if (keys["ArrowUp"] && player.y > 0) {
      player.y -= player.speed;
      player.direction = "up";
    }
    if (keys["ArrowDown"] && player.y < canvas.height) {
      player.y += player.speed;
      player.direction = "down";
    }
    if (keys["ArrowLeft"] && player.x > 0) {
      player.x -= player.speed;
      player.direction = "left";
    }
    if (keys["ArrowRight"] && player.x <canvas.width) {
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
      zombie.x = zombie.x + Math.cos(angle) * zombie.speed;
      zombie.y = zombie.y + Math.sin(angle) * zombie.speed;
      for (const bullet of player.bullets) {
        const distX = Math.abs(bullet.x - zombie.x);
        const distY = Math.abs(bullet.y - zombie.y);

        if (distX < 15 && distY < 15) {
          
          zombie.health--;
          player.bullets.splice(player.bullets.indexOf(bullet), 1);

          if (zombie.health === 0) {
          aliveZombies--;
          score++;
          zombie.isAlive = false;
          }
        }
      }

      const distX = Math.abs(player.x - zombie.x);
      const distY = Math.abs(player.y - zombie.y);

      if (distX < 15 && distY < 15) {
        gameOver = true;
      }
    }
  }

  if (aliveZombies === 0) {
    spawnZombie();
  }
}
    
    function gameLoop() {
    draw();
    updatePlayer();
    updateZombies();
    
    if (!gameOver) {
    requestAnimationFrame(gameLoop);
    }
    else {
      audio.pause();
    }
    }
    playAudio();
    gameLoop();
  });