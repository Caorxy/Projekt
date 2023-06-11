// Initialize game variables
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let alienImg = new Image();
alienImg.src = 'assets/alien.png';
let startButton = document.getElementById('start');
let quitButton = document.getElementById('quit');
let playAgain = document.getElementById('playagain');
let gameOver = document.getElementById('gameOver');
let nextLevel = document.getElementById('nextLevel');
let nextLevelButton = document.getElementById('nextLevelButton');
// Add this line to load the sound effect
//const boomSound = new Audio('assets/boom.wav');

// Add this function to play the sound effect
function playBoom() {
  //boomSound.play();
}

// Add this function to create a CSS animation for the alien
function animateBoom(alien) {
  // Create a new element for the animation
  const boom = document.createElement('div'); // Add 'div' here
  // Set the position and size of the element to match the alien
  boom.style.position = 'absolute';
  boom.style.left = alien.x + canvas.offsetLeft + 'px';
  boom.style.top = alien.y + canvas.offsetTop + 'px';
  boom.style.width = '32px';
  boom.style.height = '28px';
  // Set the background image to the alien image
  boom.style.backgroundImage = 'url(assets/alien.png)';
  // Set the initial opacity and scale of the element
  boom.style.opacity = '1';
  boom.style.transform = 'scale(1)';
  // Add a class name for the animation
  boom.className = 'boom';
  // Append the element to the body
  document.body.appendChild(boom);
  // Remove the element after the animation ends
  setTimeout(function() {
    document.body.removeChild(boom);
    animations--;
  }, 500);
}

let alienDirection = 'right';
let moveDown = false;
let tankDirection = null;
let lastShotTime = 0;
let shotInterval = 200;
let animations = 0;


// Create game objects
let aliens = [];
// Add this variable to store the current level number
let level = 1;

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
      animations = aliens.length;
      // Added this line to call the game loop
      requestAnimationFrame(gameLoop);
    }
  };
  xhr.open('GET', 'aliens' + level + '.json');
  xhr.send();
}

// Change this variable to an array of bullet objects
let bullets = [];
const tank = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 10
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

  
  // Add this part of the code to move the tank in every frame
  if (tankDirection === 'left') {
    tank.x -= 10;
  } else if (tankDirection === 'right') {
    tank.x += 10;
  }

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
        }
      }
    }
  }
  
  // Check if all aliens are killed
  if (aliensKilled === aliens.length && animations === 0) {
    nextLevel.style.display = 'block';
    return; // Stop the game loop
  }
  
  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Add event listeners for keyboard input
window.addEventListener('keydown', function (event) {
  // Move tank left or right with arrow keys
  if (event.key === 'ArrowLeft') {
    tankDirection = 'left';
  } else if (event.key === 'ArrowRight') {
    tankDirection = 'right';
  }

  // Modify this part of the code to create a new bullet when space key is pressed
  if (event.key === ' ') {
    // Get the current time in milliseconds
    let currentTime = Date.now();
    // Check if enough time has passed since the last shot
    if (currentTime - lastShotTime > shotInterval) {
      // Create a new bullet object
      let bullet = new Bullet(tank.x + 20, tank.y - 10);
      // Add it to the bullets array
      bullets.push(bullet);
      // Update the last shot time
      lastShotTime = currentTime;
    }
  }
});

// Start the game when the start button is clicked
startButton.addEventListener('click', function () {
  aliensKilled = 0;
  // Hide the menu
  menu.style.display = 'none';
  gameOver.style.display = 'none';
  nextLevel.style.display = 'none';
  // Call the loadAliens function to start the game
  loadAliens();
});

// Start the game when the start button is clicked
gameOver.addEventListener('click', function () {
  aliensKilled = 0;
  // Hide the menu
  menu.style.display = 'none';
  gameOver.style.display = 'none';
  nextLevel.style.display = 'none';
  // Call the loadAliens function to start the game
  loadAliens();
});


// Start the game when the start button is clicked
nextLevelButton.addEventListener('click', function () {
  aliensKilled = 0;
  level++;
  // Hide the menu
  menu.style.display = 'none';
  gameOver.style.display = 'none';
  nextLevel.style.display = 'none';
  if(level > 3) {
    alert("You Win!");
    level = 1;
    // Show the menu again
    menu.style.display = 'flex';    
    return; // Stop the game loop
  } else {
    loadAliens(); 
  }
});

// Quit the game when the quit button is clicked
quitButton.addEventListener('click', function () {
  // Show an alert message
  alert('Thanks for playing!');
  // Close the window
  window.close();
});

// Add this event listener to reset the tank direction when key is released
window.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      tankDirection = null;
  }
});