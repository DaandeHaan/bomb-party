const WebSocket = require('ws'); // Make sure to install this if it's not already installed
const GameManager = require('./gameService');
class SocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
    this.clientToGame = new Map();
  }

  init(wss) {
    this.wss = wss;

    this.wss.on('connection', (ws, request) => {

      const sessionID = new URL(request.url, `http://${request.headers.host}`).searchParams.get('sessionID');
      const gameID = new URL(request.url, `http://${request.headers.host}`).searchParams.get('gameID');
      const username = new URL(request.url, `http://${request.headers.host}`).searchParams.get('username');
  
      const game = GameManager.getGame(gameID);
  
      // If the game doesn't exist, close the connection
      if (!game)
        return ws.close();
  
      // If player is already in the game, close the connection
      if (game.players.find(player => player.sessionID === sessionID))
        return ws.close();
  
      this.clients.set(`${sessionID}-${game.gameID}`, ws);
      this.clientToGame.set(`${sessionID}-${game.gameID}`, game);
  
      game.addPlayerToGame(sessionID, username);
  
      this.sendGameObject({...game});
      
      // Handle disconnection
      ws.on('close', () => {
        this.onDisconnect(game, sessionID);
      });

      // Handle incoming messages
      ws.on('message', (data) => {
        this.handleRecivedMessage(sessionID, gameID, data);
      });
    });
  }

  onDisconnect(game, sessionID) {
    game.removePlayerFromGame(sessionID);

    this.clientToGame.delete(`${sessionID}-${game.gameID}`);
    this.clients.delete(sessionID);

    if (game.players.length === 0)
      return GameManager.deleteGame(game.gameID);
  }

  sendGameObject(Game) {
    Game.players.forEach(player => {
      const ws = this.clients.get(`${player.sessionID}-${Game.gameID}`);
  
      let gameObjectForUser = Game;
  
      gameObjectForUser = {
        ...Game, // Spread the rest of the gameObject properties
        // ...GameManager.getGame(Game.gameID).getGame(), // Spread the rest of the gameObject properties
        players: Game.players.map(gamePlayer => {
          const { sessionID, ...playerWithoutSessionID } = gamePlayer; // Destructure and remove sessionID
          if (gamePlayer.sessionID === player.sessionID) {
            return { ...playerWithoutSessionID, isYou: true }; // Add isYou: true for the matching player
          } else {
            return { ...playerWithoutSessionID, isYou: false }; // Add isYou: false for others
          }
        })
      };

      // Remove TimeOut prop from gameObjectForUser
      delete gameObjectForUser.timerInterval;
  
      this.send(ws, gameObjectForUser);
    });
  }

  sendMessage(sessionID, message) {
    const ws = this.clients.get(sessionID);
    this.send(ws, message);
  }

  send(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Failed to send message:`, error);
      }
    }
  }

  handleRecivedMessage(sessionID, gameID, data) {
    try {

      if (Buffer.isBuffer(data))
        data = data.toString();

      const message = JSON.parse(data);

      const game = this.clientToGame.get(`${sessionID}-${gameID}`);

      if(message.type == 'readyUp')
        game.readyUp(sessionID)

      if (message.type == 'submit')
        game.guessWord(message.word);

      if(message.type == 'typing')
        game.setText(sessionID, message.currentText);

      if(message.type == 'gameStart')
        game.startGame();

      this.sendGameObject(this.clientToGame.get(`${sessionID}-${gameID}`));

    } catch (error) {
      console.error(`Failed to parse message from ${sessionID}:`, error);
    }
  }
}

module.exports = new SocketService();
