// A simple Node.js server using Express to handle CS:GO Game State Integration.
// This server will listen for POST requests from CS:GO, parse the game state,
// and log the Steam IDs of all players in the match.

// Import the express library
const express = require('express');

// Create a new express application
const app = express();
// Define the port to listen on. CS:GO GSI uses a URI in the cfg file,
// so this should match. 3000 is a common choice.
const port = 3000;

// Middleware to parse the incoming JSON payload from CS:GO.
app.use(express.json());

// Main endpoint to receive GSI data.
// CS:GO will send a POST request to this endpoint with the game state.
app.post('/', (req, res) => {
  // Extract the game state data from the request body.
  const gameState = req.body;

  // Basic check to see if we received game data.
  if (!gameState || Object.keys(gameState).length === 0) {
    console.log('Received an empty game state payload.');
    res.status(400).send('Bad Request: Empty payload.');
    return;
  }

  console.log('--- New Game State Update Received ---');

  // Check if there is player data.
  if (gameState.player && gameState.player.steamid) {
    console.log(`Current Player Steam ID: ${gameState.player.steamid}`);
  }

  // Check if there is data on all players in the match.
  if (gameState.allplayers) {
    console.log('--- All Players in the Match ---');
    
    // Iterate over the allplayers object to find each player's Steam ID.
    for (const steamid in gameState.allplayers) {
      if (gameState.allplayers.hasOwnProperty(steamid)) {
        const player = gameState.allplayers[steamid];
        console.log(`- Player Name: ${player.name}, Steam ID: ${steamid}, Team: ${player.team}`);
      }
    }
  } else {
    console.log('No "allplayers" data available in this update.');
  }

  // Respond to the GSI request to acknowledge receipt.
  // This is required by CS:GO to ensure the updates continue.
  res.status(200).send('OK');
});

// Set the server to listen on the specified port and IP address.
// Inside the Docker container, listening on '0.0.0.0' allows it to be
// accessible from the host machine via the exposed port.
app.listen(port, '0.0.0.0', () => {
  console.log(`GSI Server listening at http://0.0.0.0:${port}`);
  console.log('Waiting for a game state update from CS:GO...');
});
