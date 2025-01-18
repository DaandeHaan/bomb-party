class Game {
  constructor({ gameOwner }) {
    this.gameID = Array.from({ length: 4 }, () => 
      String.fromCharCode(97 + Math.floor(Math.random() * 26)) // Random letter from a-z
    ).join('').toUpperCase(); // Random 4-letter string
    
    this.gameState = 'lobby';
    this.gameOwner = gameOwner;

    this.players = []; // Object: {id: string, name: string}
    this.lobby = [gameOwner];

    this.currentPlayer = null;
    this.currentHint = "";	
    this.guessedWords = [];
    this.timer = 10;


    this.diffuculty = 'beginner'; // baby, beginner, easy, medium, hard, expert, hardcore
    this.language = 'dutch';
  }

  addPlayer(player) {

    // Check if player is already in the game
    if (this.players.find(p => p.id === player.id))
      return false;

    this.lobby.push(player);
    return true;
  }

  removePlayer(player) {
    this.players = this.players.filter(p => p.id !== player.id);
  }

  getPlayers() {
    return this.players;
  }

  joinGame(player) {
    // Check if player is already in the game
    if (this.players.find(p => p.id === player.id))
      return false;

    this.players.push(player);
    this.lobby.removePlayer(player);
    
    return true;
  }

  startGame() {
    // Reset values
    this.guessedWords = [];

    // Set the timer to 10 seconds
    this.timer = 10;

    // Set the game state to playing
    this.gameState = 'playing';

    // Set the current player to a random player
    this.currentPlayer = this.players[Math.floor(Math.random() * this.players.length)];

    // Get a random hint
    this.currentHint = wordService.getHint(this.language, this.diffuculty);


  }

}

module.exports = Game;