const wordService = require("./wordService");

class Game {
  constructor() {
    this.gameID = Array.from({ length: 4 }, () => 
      String.fromCharCode(97 + Math.floor(Math.random() * 26)) // Random letter from a-z
    ).join('').toUpperCase(); // Random 4-letter string
    
    this.gameState = 'lobby';
    this.players = [];
    this.currentHint = "";	
    this.guessedWords = [];
    this.timer = 10;
    this.timerInterval = null;

    this.diffuculty = 'beginner'; // baby, beginner, easy, medium, hard, expert, hardcore
    this.language = 'dutch';
  }

  addPlayer(player) {

    // Check if player is already in the game
    if (this.players.find(p => p.sessionID === player.sessionID))
      return false;

    this.players.push(player);

    // Get the first player as owner
    this.players[0].isOwner = true;

    return true;
  }

  // Add checks to switch to next player and get a new hint if he was the active player
  removePlayer(player) {
    this.players = this.players.filter(p => p.sessionID !== player);

    if (this.players.length === 0) {
      return gameManagerInstance.deleteGame(this.gameID);
    }

    this.players[0].isOwner = true;
  }

  getPlayers() {
    return this.players;
  }

  // This function will be executed when a player joins the game from the lobby
  joinGame(player) {

    // Check if game state is lobby
    if (this.gameState !== 'lobby')
      return false;

    // Check if player is already in the game
    const foundPlayer = this.players.find(p => p.sessionID === player)
    
    if (!foundPlayer)
      return false;

    if (foundPlayer.isReady)
      return false;

    foundPlayer.isReady = true;
    return true;
  }

  startGame() {
    if (this.gameState !== 'lobby')
      return;

    // Reset values
    this.guessedWords = [];

    // Set the timer to 10 seconds
    this.timer = 10;

    // Clear text for all users
    

    // Set the game state to playing
    this.gameState = 'playing';

    // Set the current player to a random player
    const randomPlayer = this.players[Math.floor(Math.random() * this.players.length)];
    randomPlayer.currentPlayer = true;

    // Get a random hint
    this.currentHint = wordService.getHint(this.language, this.diffuculty);

    // Start Timer
    this.startTimer();
  }

  setText(sessionID, text) {

    if (this.gameState !== 'playing')
      return;

    const player = this.players.find(p => p.sessionID === sessionID);

    if (!player)
      return;

    player.currentText = text;
  }

  guessWord(word) {

    if (this.gameState !== 'playing')
      return;

    // Check if word is not already guessed
    if (this.guessedWords.includes(word))
      return this.players.find(p => p.currentPlayer === true).currentText = "";

    // Check if hint is in the word
    if (!word.includes(this.currentHint))
      return this.players.find(p => p.currentPlayer === true).currentText = "";
    
    // Check if word exists wordService.checkWord
    if (!wordService.checkWord(this.currentHint, this.language, word)) 
      return this.players.find(p => p.currentPlayer === true).currentText = "";

    // Switch to next player
    getNewPlayer();

    // Add word to guessed words
    this.guessedWords.push(word);

    // Decrease timer (This should go based on the length of the word)
    this.timer -= 0.5;

    // Get a new hint
    this.currentHint = wordService.getHint(this.language, this.diffuculty);

    this.players.find(p => p.currentPlayer === true).currentText = "";
  }

  getNewPlayer() {
    const currentPlayer = this.players.findIndex(p => p.currentPlayer === true);
    this.players[currentPlayer].currentPlayer = false;

    // Get the next player (that is ready and has lives)
    let nextPlayer = this.players[currentPlayer + 1];
    while (!nextPlayer.isReady || nextPlayer.lives === 0) {
      nextPlayer = this.players[(currentPlayer + 1) % this.players.length];
    }

    nextPlayer.currentPlayer = true;
    this.resetTimer(); // Reset the timer when the new player starts their turn
  }

  NotInTime() {
    const socketService = require("./socketService");

    // Get a new hint
    this.currentHint = wordService.getHint(this.language, this.diffuculty);

    // Reset Timer
    this.timer = 10;

    // Remove Live
    this.players.find(p => p.currentPlayer === true).lives--;

    // Check if all players are out of lives, except one
    if (this.players.filter(p => p.isReady).length === 1) {
      this.gameState = 'lobby';
      return socketService.sendGameObject(this.getGame());
  }

    // Switch to next player
    this.getNewPlayer();

    this.players.find(p => p.currentPlayer === true).currentText = "";

    socketService.sendGameObject(this.getGame());
  }

  resetTimer() {
    // Clear existing timer if there is one
    if (this.timerInterval) {
      console.log("Timer Re-Started...")
      clearTimeout(this.timerInterval);
    }
    
    // Start the timer again
    this.startTimer();
  }

  startTimer() {
    if (this.timerInterval) {
      console.log("Timer Started...")
      clearTimeout(this.timerInterval);
    }

    this.timerInterval = setTimeout(() => {
      this.NotInTime();
    }, this.timer * 1000); // Convert to milliseconds
  }

  // TODO: Remove sessionID from user's
  getGame() {
    return {
      gameID: this.gameID,
      gameState: this.gameState,
      players: this.players,
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

  createGame() {
    const game = new Game();
    this.games.push(game);
    return game;
  }

  getGame(gameID) {
    return this.games.find(game => game.gameID === gameID);
  }

  getGames() {
    return this.games;
  }

  deleteGame(gameID) {
    this.games = this.games.filter(game => game.gameID !== gameID);
  }
}

const gameManagerInstance = new GameManager();
module.exports = { Game, GameManager: gameManagerInstance };