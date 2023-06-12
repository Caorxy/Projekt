// Import the MongoClient class from the mongodb module
import { MongoClient } from 'mongodb';

// Define the MongoDB connection URL and database name
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'game';

// Export a function that will connect to MongoDB and return the database object
export function connectToDatabase() {
  // Create a new MongoClient object
  const client = new MongoClient(url);

  // Connect to MongoDB
  client.connect((err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Connected successfully to MongoDB');

    // Get the database object
    const db = client.db(dbName);

    // Do something with the database object
    // For example, you can pass it to your WebSocket handler function
    wss.on('connection', (ws) => {
      handleWebSocketConnection(ws, db);
    });
  });
}
