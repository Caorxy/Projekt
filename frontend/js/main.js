// Initialize game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const alienImg = new Image();
alienImg.src = 'assets/alien.png';
const startButton = document.getElementById('start');
const quitButton = document.getElementById('quit');
const playAgain = document.getElementById('playagain');
const gameOver = document.getElementById('gameOver');


let alienDirection = 'right';
let moveDown = false;

// Create game objects
const aliens = [];

// Add this function to load the aliens from the JSON file
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
      // Added this line to call the game loop
      requestAnimationFrame(gameLoop);
    }
  };
  xhr.open('GET', '/aliens.json', true);
  xhr.send();
}

const bullet = new Bullet(60, 300);
const tank = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 20
};

let aliensKilled = 0;
let aliensLoaded = false; // Add this variable

function gameLoop() {
  
  // Check if aliens are loaded before checking if all aliens are killed
  if (!aliensLoaded) {
    requestAnimationFrame(gameLoop);
    return;
  }
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw aliens
  for (const alien of aliens) {
    if (alien.alive) {
      ctx.drawImage(alienImg, alien.x, alien.y, 40, 35);
    }
  }
  
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
  
  // Draw tank
  ctx.fillStyle = 'white';
  ctx.fillRect(tank.x, tank.y, tank.width, tank.height);
  
  // Check for collisions between player and aliens 
  for (const alien of aliens) {
    if (alien.alive && 
        tank.x < alien.x + alien.width &&
        tank.x + tank.width > alien.x &&
        tank.y < alien.y + alien.height && 
        tank.y + tank.height > alien.y) {
      // Show the game over element
      gameOver.style.display = 'block';
      return; // Stop the game loop
    }
  }
  
  // Check for collisions between aliens and bottom of screen
  for (let i = 0; i < aliens.length; i++) {
    if (aliens[i].y + 35 >= canvas.height) {
      // Show the gameOver
      gameOver.style.display = 'flex';
      return; // Stop the game loop
    }
  }
  
  // Draw bullet
  if (bullet.visible) {
    ctx.fillStyle = 'white';
    ctx.fillRect(bullet.x, bullet.y, 10, 50);
    bullet.moveUp();
    
    // Check for collisions
    for (const alien of aliens) {
      if (alien.alive && bullet.y <= alien.y + 35 && bullet.y >= alien.y && bullet.x >= alien.x && bullet.x <= alien.x + 40) {
        alien.kill();
        bullet.kill();
        aliensKilled++; // Increment aliensKilled when an alien is killed
      }
    }
  }
  
  // Check if all aliens are killed
  if (aliensKilled === aliens.length) {
    alert("You Win!");
    // Show the menu again
    menu.style.display = 'flex';    
    return; // Stop the game loop
  }
  
  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Add event listeners for keyboard input
window.addEventListener('keydown', function (event) {
  // Move tank left or right with arrow keys
  if (event.key === 'ArrowLeft') {
    tank.x -= 10;
  } else if (event.key === 'ArrowRight') {
    tank.x += 10;
  }
// Fire bullet with spacebar
  if (event.key === ' ') {
  // Only fire if bullet is not active
  if (!bullet.active) {
    bullet.start(tank.x + 20, tank.y - 50);
  }
  }
});

// Start the game when the start button is clicked
startButton.addEventListener('click', function () {
  aliensKilled = 0;
  // Hide the menu
  menu.style.display = 'none';
  gameOver.style.display = 'none';
  // Call the loadAliens function to start the game
  loadAliens();
});

// Start the game when the start button is clicked
gameOver.addEventListener('click', function () {
  aliensKilled = 0;
  // Hide the menu
  menu.style.display = 'none';
  gameOver.style.display = 'none';
  // Call the loadAliens function to start the game
  loadAliens();
});

// Quit the game when the quit button is clicked
quitButton.addEventListener('click', function () {
  // Show an alert message
  alert('Thanks for playing!');
  // Close the window
  window.close();
});
