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
    next();
  });

app.use(require("./middleware/sessionMiddleware.js"));

app.use('/api/game', require("./controllers/gameController.js"))

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
