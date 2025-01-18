const { v4: uuidv4 } = require('uuid'); // To generate unique IDs

class socketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
  }

  init(wss) {
    this.wss = wss;
  }

  connect(sessionID) {
    wss.on('connection', (ws) => {
      this.clients.set(sessionID, ws); // Store the client in the map
  
      console.log(`Client connected: ${sessionID}`);
  
      // Handle disconnection
      ws.on('close', () => {
        this.clients.delete(sessionID); // Remove the client from the map
        console.log(`Client disconnected: ${sessionID}`);
      });
  
      // Handle incoming messages (optional)
      ws.on('message', (message) => {
          console.log(`Message from ${sessionID}:`, message);
      });
  
      // Send a welcome message to the client
      ws.send(JSON.stringify({ message: 'Welcome!', sessionID }));
    });
  }

  sendMessage(recivers = [], message = "") {
    recivers.forEach((sessionID) => {
      const ws = this.clients.get(sessionID); // Retrieve the WebSocket connection by sessionID
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message)); // Send the message if the connection is open
      }
    });
  }
}

module.exports = new socketService();