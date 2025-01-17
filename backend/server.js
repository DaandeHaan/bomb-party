const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const port = 3000;

// Serve static files (optional)
app.use(express.static('public'));
app.use(express.json());

// Create an HTTP server
const server = http.createServer(app);

// Attach WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Echo: ${message}`);
    });

    ws.on('close', () => console.log('WebSocket connection closed'));
});

app.use('/game', require("./controllers/gameController.js"))

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
