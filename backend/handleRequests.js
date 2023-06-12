// Create a WebSocket object and connect to the server
const ws = new WebSocket('ws://localhost:8080');

// Handle open event
ws.onopen = () => {
  console.log('Connected to the server');
};

// Handle message event
ws.onmessage = (event) => {
  console.log('Received message: %s', event.data);

  // Parse the message as JSON
  let data;
  try {
    data = JSON.parse(event.data);
  } catch (err) {
    console.error(err);
    return;
  }

  // Check the type of the message
  switch (data.type) {
    case 'saved': // The score and nick of the player have been saved
      // Show a confirmation message to the player
      alert(`Your score has been saved with id: ${data.id}`);
      break;
    case 'scoreboard': // The scoreboard with top scores has been loaded
      // Show the scoreboard to the player
      displayScoreboard(data.scores);
      break;
    default: // Unknown message type
      console.log('Unknown message type: %s', data.type);
      break;
  }
};

// Handle close event
ws.onclose = () => {
  console.log('Disconnected from the server');
};

// Handle error event
ws.onerror = (error) => {
  console.error(error);
};

// A function to display the scoreboard
function displayScoreboard(scores) {
  // Get the scoreboard element by its id
  const scoreboard = document.getElementById('scoreboard');

  // Clear any existing content
  scoreboard.innerHTML = '';

  // Create a table element
  const table = document.createElement('table');
  table.setAttribute('id', 'scoreboard-table');

  // Create a table header row
  const headerRow = document.createElement('tr');
  const headerNick = document.createElement('th');
  const headerScore = document.createElement('th');
  const headerDate = document.createElement('th');
  headerNick.textContent = 'Nick';
  headerScore.textContent = 'Score';
  headerDate.textContent = 'Date';
  headerRow.appendChild(headerNick);
  headerRow.appendChild(headerScore);
  headerRow.appendChild(headerDate);

  // Append the header row to the table
  table.appendChild(headerRow);

  // Loop through the scores array and create a table row for each score
  for (const score of scores) {
    const row = document.createElement('tr');
    const nick = document.createElement('td');
    const scoreValue = document.createElement('td');
    const date = document.createElement('td');
    nick.textContent = score.nick;
    scoreValue.textContent = Math.round(score.score);
    date.textContent = new Date(score.date).toLocaleString();
    row.appendChild(nick);
    row.appendChild(scoreValue);
    row.appendChild(date);

    // Append the row to the table
    table.appendChild(row);
  }

  // Append the table to the scoreboard element
  scoreboard.appendChild(table);
}

// A function to save the score and nick of the player after the game ends
function saveScore() {
  // Send a message to the server with type 'save' and data {nick, score}
  ws.send(JSON.stringify({
    type: 'save',
    nick: playerName,
    score: score
  }));
}

// A function to load the scoreboard with top scores
function loadScoreboard() {
  // Send a message to the server with type 'load' and no data
  ws.send(JSON.stringify({
    type: 'load'
  }));
}