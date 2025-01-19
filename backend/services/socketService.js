const WebSocket = require('ws'); // Make sure to install this if it's not already installed
const { GameManager } = require('./gameService');
class SocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
  }

  init(wss) {
    this.wss = wss;

    this.wss.on('connection', (ws, request) => {
      console.log('Client connected');
      const sessionID = new URL(request.url, `http://${request.headers.host}`).searchParams.get('sessionID');

      const game = GameManager.getGames().find(game => game.players.find(player => player.sessionID === sessionID));

      this.clients.set(`${sessionID}-${game.gameID}`, ws);

      console.log(`Client connected: ${sessionID}`);

      // Handle disconnection
      ws.on('close', () => {
        console.log(this.clients.get(sessionID));
        this.clients.delete(sessionID);
        console.log(`Client disconnected: ${sessionID}`);
      });

      // Handle incoming messages
      ws.on('message', (message) => {
        try {
          console.log(`Message from ${sessionID}:`, message);
          const parsedMessage = JSON.parse(message);
          this.handleRecivedMessage(sessionID, parsedMessage);
        } catch (error) {
          console.error(`Failed to parse message from ${sessionID}:`, error);
        }
      });

      // Send a welcome message to the client
      ws.send(JSON.stringify({ message: 'Welcome!', sessionID }));
    });
  }

  sendMessage(receivers = [], gameID, message = '') {
    receivers.forEach((sessionID) => {
      const ws = this.clients.get(`${sessionID}-${gameID}`);
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Failed to send message to ${sessionID}:`, error);
        }
      } else {
        console.warn(`Connection not open for ${sessionID}`);
      }
    });
  }

  broadcast(message = '') {
    this.clients.forEach((ws, sessionID) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Failed to broadcast message to ${sessionID}:`, error);
        }
      }
    });
  }

  handleRecivedMessage(sessionID, message) {
    if(parsedMessage.type == 'readyUp'){

    }
    // Events:
    // - 'typing': user typed a letter
    // - 'submit' user submitted the word
    // - 'gameStart': user started a new game
    // - 'readyUp': user is ready to start the game
    console.log(message);
  }
}

module.exports = new SocketService();
