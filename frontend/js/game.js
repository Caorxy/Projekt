// Initialize game variables
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let alienImg = new Image();
alienImg.src = 'frontend/assets/alien.png';
let startButton = document.getElementById('start');
let scoreboardButton = document.getElementById('scoreBoardButton');
let playAgain = document.getElementById('playagain');
let gameOver = document.getElementById('gameOver');
let nextLevel = document.getElementById('nextLevel');
let nextLevelButton = document.getElementById('nextLevelButton');
let inpuSection = document.getElementById("input-section");
let startButtonAfterNick = document.getElementById("start-button");
let nickInput = document.getElementById("nick-input");
let backButton = document.getElementById("back-button");
let alienDirection = 'right';
let moveDown = false;
let tankDirection = null;
let lastShotTime = 0;
let shotInterval = 200;
let animations = 0;
let bullets = [];
let tank = new Tank(canvas.width / 2 - 25, canvas.height - 50, 50, 10);
let aliensKilled = 0;
let aliensLoaded = false;
let score = 0;
let playerName = "";
let time = 0;
let startTime = 0;


// Create game objects
let aliens = [];
let level = 1;

//Load the aliens from the JSON file
function loadAliens() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const alienData = JSON.parse(xhr.responseText);
      // Clear the aliens array before pushing new data
      aliens.length = 0;
      for (const data of alienData) {
        aliens.push(new Alien(data.x, data.y));
      }
      // Start the game loop after the aliens are loaded
      aliensLoaded = true;
      animations = aliens.length;
      // Added this line to call the game loop
      requestAnimationFrame(gameLoop);
    }
  };
  xhr.open('GET', 'frontend/aliens' + level + '.json');
  xhr.send();
}

function gameLoop() {
  
  // Check if aliens are loaded before checking if all aliens are killed
  if (!aliensLoaded) {
    requestAnimationFrame(gameLoop);
    return;
  }
  
  // Update the time variable with the current time in seconds
  let currentTime = Date.now() / 1000;

  // If the start time is zero, set it to the current time
  if (startTime === 0) {
    startTime = currentTime;
  }

  // Calculate the time elapsed since the start of the game
  time = currentTime - startTime;
  
  drawAliens();
  moveAliens();
  drawTank();
  moveTank();
  drawScore();

  for (const alien of aliens) {
    if (alien.alive && 
        tank.x < alien.x + alien.width &&
        tank.x + tank.width > alien.x &&
        tank.y < alien.y + alien.height && 
        tank.y + tank.height > alien.y) {
      // Show the game over element
      gameOver.style.display = 'flex';
      // Save the score and nick of the player 
      saveScore();
      return; // Stop the game loop
    }
  }

  // Check for collisions between aliens and bottom of screen
  for (let i = 0; i < aliens.length; i++) {
    if (aliens[i].y + 35 >= canvas.height) {
      // Show the gameOver
      gameOver.style.display = 'flex';
      // Save the score and nick of the player 
      saveScore();
      return; // Stop the game loop
    }
  }
  
  moveBullets();
  
  // Check if all aliens are killed
  if (aliensKilled === aliens.length && animations === 0) {
    if(level > 2) {
      // Save the score and nick of the player 
      saveScore();
    }
    nextLevel.style.display = 'flex';
    return; // Stop the game loop
  }
  
  // Request next frame
  requestAnimationFrame(gameLoop);
}

function drawAliens(){
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw aliens
  for (const alien of aliens) {
    if (alien.alive) {
      ctx.drawImage(alienImg, alien.x, alien.y, 40, 35);
    }
  }
}

function moveAliens() {
    // Move aliens
    for (const alien of aliens) {
      if (alien.alive) {
        if (moveDown) {
          alien.move('down');
        } else {
          alien.move(alienDirection);
        }
      }
    }
    
    // Check if aliens should change direction or move down
    if (moveDown) {
      moveDown = false;
      alienDirection = alienDirection === 'right' ? 'left' : 'right';
    } else {
      for (const alien of aliens) {
        if (alien.alive && ((alienDirection === 'right' && alien.x + 40 >= canvas.width) || (alienDirection === 'left' && alien.x <= 0))) {
          moveDown = true;
          break;
        }
      }
    }
}

function drawTank(){
  // Draw tank body
  ctx.fillStyle = 'darkgreen';
  ctx.fillRect(tank.x, tank.y + tank.height / 4, tank.width, tank.height * 3 / 4);

  // Draw tank turret
  ctx.beginPath();
  ctx.arc(tank.x + tank.width / 2, tank.y + tank.height / 2, tank.width / 4, 0, 2 * Math.PI);
  ctx.fill();

  // Draw tank barrel
  ctx.fillRect(tank.x + tank.width / 2 - tank.width / 16, tank.y + tank.height / 4 - tank.width / 4, tank.width / 8, tank.width / 4);

  // Draw tank tracks
  ctx.fillStyle = 'black';
  ctx.fillRect(tank.x, tank.y + tank.height * 5 / 6, tank.width, tank.height / 6);
  ctx.fillRect(tank.x, tank.y + tank.height / 4, tank.width, tank.height / 6);
}

function moveTank(){
  if (tankDirection === 'left') {
    tank.x -= 10;
  } else if (tankDirection === 'right') {
    tank.x += 10;
  }
}

function moveBullets(){
  // Modify this part of the code to move all the bullets in every frame
  for (const bullet of bullets) {
    if(bullet.visible == true && bullet.active == true) {
      // Draw bullet
      ctx.fillStyle = 'darkmagenta';
      ctx.fillRect(bullet.x, bullet.y, 4, 10);
      bullet.moveUp();
      
      // Check for collisions
      for (const alien of aliens) {
        if (alien.alive && bullet.y <= alien.y + 35 && bullet.y >= alien.y && bullet.x >= alien.x && bullet.x <= alien.x + 40) {
          alien.kill();
          bullet.kill();
          aliensKilled++; // Increment aliensKilled when an alien is killed
          // Add these lines to play the sound and animate the boom
          playBoom();
          animateBoom(alien);
          // Increment the score by a formula that depends on the level and the time elapsed
          score += level * 1000 / time;
        }
      }
    }
  }
}

// Create a function to draw the score and the player's name on the canvas
function drawScore() {
  // Set the font style and color
  ctx.font = "20px Orbitron";
  ctx.fillStyle = "white";

  // Set the text alignment and baseline
  ctx.textAlign = "right";
  ctx.textBaseline = "top";

  // Set the text content and coordinates
  // Use Math.round() to round the score value to the nearest integer
  // Increase the y-coordinate by 10 pixels to add some margin top
  ctx.fillText(`Score: ${Math.round(score)}`, canvas.width - 10, 40);
  ctx.fillText(`Player: ${playerName}`, canvas.width - 10, 70);
  ctx.fillText(`Level: ${level}`, canvas.width - 10, 100);

}
