const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const bodyParser = require('body-parser');
const socketService = require('./services/socketService.js');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Serve static files (optional)
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

socketService.init(wss);

app.use('/game', require("./controllers/gameController.js"))
app.use('/session', require("./controllers/sessionController.js"))

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
