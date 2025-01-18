const { v4: uuidv4 } = require('uuid'); // To generate unique IDs

class socketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
  }

  init(wss) {
    this.wss = wss;
  }

  connect() {
    wss.on('connection', (ws) => {
      const clientId = uuidv4(); // Generate a unique ID
      this.clients.set(clientId, ws); // Store the client in the map
  
      console.log(`Client connected: ${clientId}`);
  
      // Handle disconnection
      ws.on('close', () => {
        this.clients.delete(clientId); // Remove the client from the map
        console.log(`Client disconnected: ${clientId}`);
      });
  
      // Handle incoming messages (optional)
      ws.on('message', (message) => {
          console.log(`Message from ${clientId}:`, message);
      });
  
      // Send a welcome message to the client
      ws.send(JSON.stringify({ message: 'Welcome!', clientId }));
  });
  
  }

  sendMessage(recivers = [], message = "") {
    recivers.forEach((clientId) => {
      const ws = this.clients.get(clientId); // Retrieve the WebSocket connection by clientId
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message)); // Send the message if the connection is open
      }
    });
  }
}

module.exports = new socketService();