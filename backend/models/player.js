const { v4: uuidv4 } = require('uuid');

class Player {
  constructor(sessionID, username, lives) {
    this.id = uuidv4();
    this.sessionID = sessionID;
    this.username = username;
    this.isReady = false;
    this.currentPlayer = false;
    this.isOwner = false;
    this.currentText = "";
    this.lives = lives;
    this.lastWinner = false;
  }
}

module.exports = Player;