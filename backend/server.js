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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.use(require("./middleware/sessionMiddleware.js"));

app.use('/api/game', require("./controllers/gameController.js"))

// Start the WebSocket server
server.listen(8080, () => {
  console.log(`WS-Server running at http://localhost:8080/`);
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}/`);
});
