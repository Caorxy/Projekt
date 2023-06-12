// Add event listeners for keyboard input
window.addEventListener('keydown', function (event) {
  // Move tank left or right with arrow keys
  if (event.key === 'ArrowLeft') {
    tankDirection = 'left';
  } else if (event.key === 'ArrowRight') {
    tankDirection = 'right';
  }

  // Modify this part of the code to create a new bullet when space key is pressed
  if (event.key === ' ' && nextLevel.style.display === 'none') {
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

startButtonAfterNick.addEventListener("click",function() {
  // Get the value of the input element and store it in a variable
  playerName = nickInput.value;
  // Hide the input section when the game starts
  document.getElementById("input-section").style.display = "none";
  // Call the loadAliens function to start the game
  loadAliens();
});


// Start the game when the start button is clicked
startButton.addEventListener('click', function () {
  aliensKilled = 0;
  time = 0;
  startTime = 0;
  score = 0;
  // Hide the menu
  menu.style.display = 'none';
  gameOver.style.display = 'none';
  nextLevel.style.display = 'none';
  inpuSection.style.display = 'flex';
});

backButton.addEventListener('click', function() {
  aliensKilled = 0;
  time = 0;
  startTime = 0;
  score = 0;
  // Hide the menu
  menu.style.display = 'flex';
  gameOver.style.display = 'none';
  nextLevel.style.display = 'none';
  inpuSection.style.display = 'none';
  backButton.style.display = 'none';
  document.getElementById('scoreboard').style.display = 'none';
})

// Start the game when the start button is clicked
gameOver.addEventListener('click', function () {
  aliensKilled = 0;
  time = 0;
  startTime = 0;
  score = 0;
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
  time = 0;
  startTime = 0;
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
scoreboardButton.addEventListener('click', function () {
  loadScoreboard();
  document.getElementById('scoreboard').style.display = 'flex';
  backButton.style.display = 'flex';
});

// Add this event listener to reset the tank direction when key is released
window.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      tankDirection = null;
  }
});
