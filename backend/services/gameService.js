const socketService = require("./socketService");

class Game {
  constructor({ gameOwner }) {
    this.gameID = Array.from({ length: 4 }, () => 
      String.fromCharCode(97 + Math.floor(Math.random() * 26)) // Random letter from a-z
    ).join('').toUpperCase(); // Random 4-letter string
    
    this.gameState = 'lobby';
    this.gameOwner = gameOwner;

    this.activePlayers = []; // Object: {id: string, name: string}
    this.lobby = [];

    this.currentPlayer = null;
    this.currentHint = "";	
    this.guessedWords = [];
    this.timer = 10;


    this.diffuculty = 'beginner'; // baby, beginner, easy, medium, hard, expert, hardcore
    this.language = 'dutch';
  }

  addPlayer(player) {

    // Check if player is already in the game
    if (this.activePlayers.find(p => p.id === player.id))
      return false;

    this.lobby.push(player);
    return true;
  }

  removePlayer(player) {
    this.activePlayers = this.activePlayers.filter(p => p.id !== player.id);
  }

  getPlayers() {
    return this.activePlayers;
  }

  // This function will be executed when a player joins the game from the lobby
  joinGame(player) {

    // Check if game state is lobby
    if (this.gameState !== 'lobby')
      return false;

    // Check if player is already in the game
    if (this.activePlayers.find(p => p.id === player.id))
      return false;

    // Add player to the game, remove from lobby
    this.activePlayers.push(player);
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
    this.currentPlayer = this.activePlayers[Math.floor(Math.random() * this.activePlayers.length)];

    // Get a random hint
    this.currentHint = wordService.getHint(this.language, this.diffuculty);

    socketService.sendMessage([this.activePlayers.map(p => p.id), this.lobby.map(p => p.id)], {...this.getGame()});
  }

  guessWord(word) {
    // Check if word is not already guessed

    // Check if hint is in the word
    
    // Check if word exists wordService.checkWord

    // Switch to next player

    // Add word to guessed words

    // Decrease timer

    // Get a new hint
  }

  // TODO: Remove sessionID from user's
  getGame() {
    return {
      gameID: this.gameID,
      gameState: this.gameState,
      gameOwner: this.gameOwner,
      activePlayers: this.activePlayers,
      lobby: this.lobby,
      currentPlayer: this.currentPlayer,
      currentHint: this.currentHint,
      guessedWords: this.guessedWords,
      timer: this.timer,
      language: this.language,
      diffuculty: this.diffuculty,
    }
  }

}

class GameManager {
  constructor() {
    this.games = [];
  }

  createGame({ gameOwner }) {
    const game = new Game({ gameOwner });
    this.games.push(game);
    return game;
  }

  getGame(gameID) {
    return this.games.find(game => game.gameID === gameID);
  }

  getGames() {
    return this.games;
  }
}

const gameManagerInstance = new GameManager();
module.exports = { Game, GameManager: gameManagerInstance };