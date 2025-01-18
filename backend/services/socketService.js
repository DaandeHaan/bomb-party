const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws'); // Make sure to install this if it's not already installed

class SocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
  }

  init(wss) {
    this.wss = wss;

    this.wss.on('connection', (ws) => {
      const sessionID = req.url.split('?sessionID=')[1];
      this.clients.set(sessionID, ws);

      console.log(`Client connected: ${sessionID}`);

      // Handle disconnection
      ws.on('close', () => {
        this.clients.delete(sessionID);
        console.log(`Client disconnected: ${sessionID}`);
      });

      // Handle incoming messages
      ws.on('message', (message) => {
        try {
          console.log(`Message from ${sessionID}:`, message);
          const parsedMessage = JSON.parse(message);
          // You can handle parsedMessage here, e.g., route actions or responses
        } catch (error) {
          console.error(`Failed to parse message from ${sessionID}:`, error);
        }
      });

      // Send a welcome message to the client
      ws.send(JSON.stringify({ message: 'Welcome!', sessionID }));
    });
  }

  sendMessage(receivers = [], message = '') {
    receivers.forEach((sessionID) => {
      const ws = this.clients.get(sessionID);
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
}

module.exports = new SocketService();
