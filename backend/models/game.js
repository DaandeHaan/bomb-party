const wordService = require("../services/wordService");

class Game {
  constructor() {
    this.gameID = Array.from({ length: 4 }, () => 
      String.fromCharCode(97 + Math.floor(Math.random() * 26)) // Random letter from a-z
    ).join('').toUpperCase(); // Random 4-letter string
    
    this.defaultTimer = 10;
    this.diffuculty = 'beginner'; // baby, beginner, easy, medium, hard, expert, hardcore
    this.language = 'dutch';

    this.gameState = 'lobby';
    this.players = [];
    this.currentHint = "";	
    this.guessedWords = [];
    this.timer = this.defaultTimer;
    
    this.timerInterval = null;
  }

  addPlayerToGame(sessionID, username) {

    const player = {
      sessionID: sessionID,
      username: username,
      isReady: false,
      currentPlayer: false,
      isOwner: false,
      currentText: "",
      lives: 2,
      lastWinner: false,
    }

    // Check if player is already in the game
    if (this.players.find(p => p.sessionID === player.sessionID))
      return false;

    this.players.push(player);
    
    // Get the first player as owner
    this.players[0].isOwner = true;
    
    this.sendGameObject();

    return true;

  }

  removePlayerFromGame(sessionID) {

    // Check if the player was the current player
    if (this.players.find(p => p.sessionID === sessionID).currentPlayer)
      this.nextTurn();

    this.players = this.players.filter(p => p.sessionID !== sessionID);

    if (this.players.length === 0)
      return gameManagerInstance.deleteGame(this.gameID);

    this.checkWinner();

    this.players[0].isOwner = true;

    this.sendGameObject();
  }

  readyUp(player) {

    if (this.gameState !== 'lobby')
      return false;

    // Check if player is already in the game
    const foundPlayer = this.players.find(p => p.sessionID === player)
    
    if (!foundPlayer)
      return false;

    if (foundPlayer.isReady)
      foundPlayer.isReady = false;
    else
      foundPlayer.isReady = true;

    return true;
  }

  startGame() {
    if (this.gameState !== 'lobby')
      return;

    if (this.players.filter(p => p.isReady).length < 2)
      return socketService.sendMessage(this.players.find(p => p.isOwner).sessionID, {Success: false, message: 'NOT_ENOUGH_PLAYERS'});

    this.resetValues();

    this.gameState = 'playing';
    this.players[Math.floor(Math.random() * this.players.length)].currentPlayer = true;
    this.currentHint = wordService.getHint(this.language, this.diffuculty).toLowerCase().trim();
    this.startTimer();
  }

  checkWinner() {

    // Check how many players are still in the game
    const playersLeft = this.players.filter(p => p.isReady && p.lives > 0).length;
    if (playersLeft > 1)
      return false; 

    const winner = this.players.find(p => p.isReady && p.lives > 0);
    
    this.players.forEach(p => {
      p.lastWinner = false;
    });

    this.resetValues();
    winner.lastWinner = true;

    clearTimeout(this.timerInterval);

    this.sendGameObject();
    return true;
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

    word = word.toLowerCase().trim()

    const currentPlayer = this.players.find(p => p.currentPlayer === true);

    // Check if word has already been guessed
    if (this.guessedWords.map(w => w.toLowerCase()).includes(word))
      return this.setText(currentPlayer, "")
    
    // Check if hint is in the word (case-insensitive)
    if (!word.includes(this.currentHint.toLowerCase().trim()))
      return this.setText(currentPlayer, "")
    
    // Check if word exists using wordService.checkWord (case-insensitive)
    if (!wordService.checkWord(this.currentHint, this.language, word))
      return this.setText(currentPlayer, "")

    // Add word to guessed words
    this.guessedWords.push(word);

    // Decrease timer (This should go based on the length of the word)
    this.timer -= 0.5;

    this.nextTurn();
  }

  nextTurn() {
    const newPlayer = this.getNewPlayer();
    
    this.currentHint = wordService.getHint(this.language, this.diffuculty);

    setText(newPlayer.sessionID, "");

    this.resetTimer();

    // ? Send game object
  }

  getNewPlayer() {
    const currentPlayer = this.players.findIndex(p => p.currentPlayer === true);
    this.players[currentPlayer].currentPlayer = false;

    // Get the next player (that is ready and has lives)
    let nextPlayer = this.players[(currentPlayer + 1) % this.players.length];

    while (!nextPlayer.isReady || nextPlayer.lives === 0) {
      nextPlayer = this.players[(currentPlayer + 1) % this.players.length];
    }

    nextPlayer.currentPlayer = true;
    return nextPlayer;
  }

  NotInTime() {

    // Reset Timer
    this.timer = this.defaultTimer;

    // Remove Live
    this.players.find(p => p.currentPlayer === true).lives--;

    if (this.checkWinner())
      return;

    this.nextTurn();

    this.sendGameObject();
  }

  resetTimer() {
    if (this.timerInterval)
      clearTimeout(this.timerInterval);
    
    this.startTimer();
  }

  startTimer() {
    if (this.timerInterval)
      clearTimeout(this.timerInterval);

    this.timerInterval = setTimeout(() => {
      this.NotInTime();
    }, this.timer * 1000); // Convert to milliseconds
  }

  resetValues() {
    this.gameState = 'lobby';
    this.guessedWords = [];
    this.currentHint = "";
    this.timer = this.defaultTimer;

    this.players.forEach(p => {
      p.isReady = false;
      p.currentPlayer = false;
      p.currentText = "";
      p.lives = 2;
    });
  }

  sendGameObject() {
    const socketService = require("../services/socketService");
    socketService.sendGameObject(this);
  }

  getGame() {

    // Remove's the sessionID from all player objects
    const players = this.players.map(player => {
      const { sessionID, ...rest } = player;
      return rest;
    });

    return {
      gameID: this.gameID,
      gameState: this.gameState,
      players: players,
      currentHint: this.currentHint,
      guessedWords: this.guessedWords,
      timer: this.timer,
      diffuculty: this.diffuculty,
    }
  }
}

module.exports = Game;