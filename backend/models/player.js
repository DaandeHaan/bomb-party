const { v4: uuidv4 } = require('uuid');

class Player {
  constructor(sessionID, username) {
    this.id = uuidv4();
    this.sessionID = sessionID;
    this.username = username;
    this.isReady = false;
    this.currentPlayer = false;
    this.isOwner = false;
    this.currentText = "";
    this.lives = 2;
    this.lastWinner = false;
  }
}

module.exports = Player;