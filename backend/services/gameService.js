class Game {
  constructor({ gameOwner }) {
    this.gameID = Array.from({ length: 4 }, () => 
      String.fromCharCode(97 + Math.floor(Math.random() * 26)) // Random letter from a-z
    ).join('').toUpperCase(); // Random 4-letter string
    
    this.players = []; // Object: {id: string, name: string}
    this.lobby = [gameOwner];
    this.gameOwner = gameOwner;
    this.gameState = 'lobby';
    this.currentPlayer = null;
    this.currentWord = "";
    this.timer = 10;
    this.diffuculty = 'beginner'; // baby, beginner, easy, medium, hard, expert, hardcore
    this.language = 'dutch';
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(player) {
    this.players = this.players.filter(p => p.id !== player.id);
  }

  getPlayers() {
    return this.players;
  }

  startGame() {

  }

}

module.exports = Game;