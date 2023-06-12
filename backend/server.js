// Import the required modules
const http = require('http');
const WebSocket = require('ws');
const MongoClient = require('mongodb').MongoClient;

// Create a HTTP server
const server = http.createServer();

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Connect to MongoDB
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'game';
let db;

// Define an async function to connect to MongoDB
async function connectDB() {
  try {
    const client = await MongoClient.connect(url);
    console.log('Connected successfully to MongoDB');
    db = client.db(dbName);
  } catch (err) {
    console.error(err);
    return;
  }
}

// Define an async function to handle WebSocket connections
async function handleWS() {
  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    console.log('A new client connected');

    // Handle messages from the client
    ws.on('message', async (message) => {
      console.log('Received message: %s', message);

      // Parse the message as JSON
      let data;
      try {
        data = JSON.parse(message);
      } catch (err) {
        console.error(err);
        return;
      }

      let collection;
      // Check the type of the message
      switch (data.type) {
        case 'save': // Save the score and nick of the player
          // Get the collection for scores
          collection = db.collection('scores');

          // Insert the score document
          collection.insertOne({
            nick: data.nick,
            score: data.score,
            date: new Date()
          }, (err, result) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('Inserted score document: %s', result.ops[0]);

            // Send back a confirmation message
            ws.send(JSON.stringify({
              type: 'saved',
              id: result.ops[0]._id
            }));
          });
          break;
        case 'load': // Load the scoreboard with top scores
          // Get the collection for scores
          collection = db.collection('scores');
          // using await
          try {
            let docs = await collection.find().sort({ score: -1 }).limit(5).toArray();
            console.log(docs); // log the result
            ws.send(JSON.stringify({
              type: 'scoreboard',
              scores: docs
            }));
          } catch (err) {
            console.error(err); // log any errors
          }
      }
    });

    // Handle close event
    ws.on('close', () => {
      console.log('A client disconnected');
    });
  });
}

// Define an async function to start the server
async function startServer() {
  // Wait for the connection to MongoDB to be established
  await connectDB();

  // Start handling WebSocket connections
  await handleWS();

  // Start the server
  server.listen(8080, () => {
    console.log('Server listening on port 8080');
  });
}

// Call the startServer function
startServer();
