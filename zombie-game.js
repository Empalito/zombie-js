// Defining basic elements
const button = document.getElementById("button");
const audio = new Audio ('sound/01.Forever Bound - Stereo Madness.mp3');
const backgroundImage = new Image();  
backgroundImage.src = "image/background.jpg";

//When window loads the canvas context is gotten and sized to the window
window.addEventListener('load', function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



//Function that plays the audio
function playAudio () {
  if (!gameOver) {
    audio.volume = 0.2; 
    audio.play();
  } else {
    audio.pause();
  }
}
//Eventlistener that calls the audio when a button is pressed.
document.addEventListener("keydown", (e) => {
  if (e) {
    playAudio()
  }
})

//Gives the player a few properties.
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed: 6,
  isShooting: false,
  bullets: [],
  direction: "right",
  health: 100,
};
//Empty array 
const zombies = [];
let score = 0;
let gameOver = false;
let aliveZombies = 0;

//Function plays audio creates and shows a popup text when a certain score is reached.
function showLevelUpMessage(level) {
  const levelUp = new Audio('sound/rizz-sounds.mp3');
  levelUp.play();
  const popup = document.createElement('div');
  popup.innerText = `Level ${level}!`;
  popup.style.cssText = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  color: #ffffff;
  text-shadow: 0 0 10px #ffffff;
  opacity: 0;
  animation: levelUpPopup 1s ease forwards;
`;
  document.body.appendChild(popup);
  setTimeout(() => 
  popup.remove(), 1000);
}
// Add a CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes levelUpPopup {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

//An array that holds the current state of all zombies in the game and then is used to update and render them on screen.
function spawnZombie() {
  if (score === 10 || score === 20 || score === 32) {
    showLevelUpMessage(score / 10);
  }

  if (aliveZombies > 0) return;

  let zombieCount = 1;
  let zombieSpeed = 2;
  let zombieHealth = 1;

  if (score >= 10 && score < 20) {
    zombieCount = 2;
    zombieSpeed = 2;
    zombieHealth = 2;
  } else if (score >= 20 && score < 30) {
    zombieCount = 3;
    zombieSpeed = 3;
    zombieHealth = 3;
  } else if (score >= 32 && score < 50) {
    zombieCount = 7;
    zombieSpeed = 5;
    zombieHealth = 4;
  }

  for (let i = 0; i < zombieCount; i++) {
    zombies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: zombieSpeed,
      isAlive: true,
      health: zombieHealth,
    });
    aliveZombies++;
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

images.up.src='image/ShooterUp.png'
images.down.src='image/ShooterDown.png'
images.right.src='image/ShooterRight.png'
images.left.src='image/ShooterLeft.png'

const zombieImage = new Image ();
zombieImage.src = 'image/zombie.png';

function drawPlayerHealthBar() {
  const healthBarWidth = 100;
  const healthBarHeight = 10;
  const healthBarX = player.x - healthBarWidth / 2;
  const healthBarY = player.y - 30;
  const currentHealthWidth = (healthBarWidth / 100) * player.health;

  ctx.fillStyle = "black";
  ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

  ctx.fillStyle = "green";
  ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
}
function draw() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
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

  drawPlayerHealthBar();

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

  document.getElementById("score").innerText = `Score: ${score}`;


  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);
  }
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

let bulletCooldown = 0;


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

    if (keys["Space"] && bulletCooldown <= 0) {
      bulletCooldown = 60; 
      player.isShooting = true;
      player.bullets.push({ x: player.x, y: player.y, direction: player.direction });
      const shootingSound = new Audio('sound/bullet.mp3');
      shootingSound.play();
    } 
    if (bulletCooldown > 0) bulletCooldown--;

      else {
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
        player.health -= 10;
      
      if (player.health === 0) {
        gameOver = true;
        const deathSound = new Audio('sound/geometry-dash-death-sound-effect.mp3');
        deathSound.play();
      } 

    }
  }
}

  if (aliveZombies === 0) {
    spawnZombie();
  }
}
function redirectToNewPage() {
  audio.pause();
  const discordLeave = new Audio('sound/discord-leave-noise.mp3');
  discordLeave.play();
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}
function gameLoop() {
  if (!gameOver) {
    draw();
    updatePlayer();
    updateZombies();
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width/2, canvas.height/2);
    audio.pause();
    setTimeout(redirectToNewPage, 2000);
  }
}
    playAudio();
    gameLoop();
  });