const { v4: uuidv4 } = require('uuid');

class Player {
  constructor(sessionID, username, lives) {
    this.id = uuidv4();
    this.sessionID = sessionID;
    this.username = username.length > 20 ? username.substring(0, 16) : username;
    this.isReady = false;
    this.currentPlayer = false;
    this.isOwner = false;
    this.currentText = "";
    this.lives = lives;
    this.lastWinner = false;
    this.wins = 0;
  }
}

module.exports = Player;