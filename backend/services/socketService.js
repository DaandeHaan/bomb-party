const WebSocket = require('ws'); // Make sure to install this if it's not already installed
const { GameManager } = require('./gameService');
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

      game.addPlayer({
        sessionID: sessionID,
        username: username,
        isReady: false,
        currentPlayer: false,
        isOwner: false,
        text: "",
      });

      console.log(game.players)
      console.log(game.gameID)
      console.log(game.getGame())

      this.sendGameObject({...game.getGame()});

      // Handle disconnection
      ws.on('close', () => {
        game.removePlayer(sessionID);

        this.clientToGame.delete(`${sessionID}-${game.gameID}`);
        this.clients.delete(sessionID);
      });

      // Handle incoming messages
      ws.on('message', (data) => {
        try {

          if (Buffer.isBuffer(data)) {
            data = data.toString(); // Convert buffer to string
          }

          const message = JSON.parse(data);

          this.handleRecivedMessage(sessionID, game.gameID, message);
        } catch (error) {
          console.error(`Failed to parse message from ${sessionID}:`, error);
        }
      });
    });
  }

  sendGameObject(gameObject) {

    gameObject.players.forEach(player => {

      const ws = this.clients.get(`${player.sessionID}-${gameObject.gameID}`);

      let gameObjectForUserInLoop = gameObject;

      gameObjectForUserInLoop = {
        ...gameObject, // Spread the rest of the gameObject properties
        players: gameObject.players.map(gamePlayer => {
          if (gamePlayer.sessionID === player.sessionID) {
            return { ...gamePlayer, isYou: true }; // Add isYou: true for the matching player
          } else {
            return { ...gamePlayer, isYou: false }; // Add isYou: false for others
          }
        })
      };

      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          console.log(gameObjectForUserInLoop)
          ws.send(JSON.stringify(gameObjectForUserInLoop));
        } catch (error) {
          console.error(`Failed to send message to ${player.sessionID}:`, error);
        }
      } else {
        console.warn(`Connection not open for ${player.sessionID}`);
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

  handleRecivedMessage(sessionID, gameID, message) {

    const game = this.clientToGame.get(`${sessionID}-${gameID}`);

    if(message.type == 'readyUp'){
      game.joinGame(sessionID)
    }

    if (message.type == 'submit') {
      game.guessWord(message.word);
    }

    if(message.type == 'typing') {
      game.setText(sessionID, message.text);
    }

    if(message.type == 'gameStart') {
      game.startGame();
    }

    // Events:
    // - 'typing': user typed a letter
    // - 'submit' user submitted the word
    // - 'gameStart': user started a new game
    // - 'readyUp': user is ready to start the game

    this.sendGameObject(this.clientToGame.get(`${sessionID}-${gameID}`));
  }
}

module.exports = new SocketService();
