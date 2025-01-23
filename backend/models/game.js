const wordService = require("../services/wordService");
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs

class Game {
  constructor(settings) {
    this.gameID = Array.from({ length: 4 }, () => 
      String.fromCharCode(97 + Math.floor(Math.random() * 26)) // Random letter from a-z
    ).join('').toUpperCase(); // Random 4-letter string
    
    this.diffuculty = settings.diffuculty; // baby, beginner, easy, medium, hard, expert, hardcore
    this.language = settings.language;
    this.privateGame = settings.privateGame; // Show in lobby or not
    this.maxPlayers = settings.maxPlayers;
    this.defaultTimer = settings.defaultTimer;

    this.gameState = 'lobby';
    this.players = [];
    this.currentHint = "";	
    this.guessedWords = [];
    this.timer = this.defaultTimer;
    
    this.endTime = null;
    this.timerInterval = null;
    this.lastHint = "";
    this.failedTimes = 0;
  }

  addPlayerToGame(sessionID, username) {

    // Check if the game is full
    if (this.players.length >= this.maxPlayers)
      return false;

    const player = {
      id: uuidv4(),
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
      return;

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
      return this.sendMessage(this.players.find(p => p.isOwner).sessionID, {success: false, message: 'NOT_ENOUGH_PLAYERS'});

    this.gameState = 'playing';
    this.players[Math.floor(Math.random() * this.players.length)].currentPlayer = true;
    this.currentHint = wordService.getHint(this.lastHint, this.language, this.diffuculty).toLowerCase().trim();
    this.lastHint = this.currentHint;
    this.guessedWords = [];
    this.timer = this.defaultTimer;

    this.startTimer();
  }

  checkWinner() {

    // Check how many players are still in the game
    const playersLeft = this.players.filter(p => p.isReady && p.lives > 0).length;
    if (playersLeft > 1)
      return false; 

    const winner = this.players.find(p => p.isReady && p.lives > 0);

    if (!winner)
      return false;
    
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
    if (this.guessedWords.map(w => w.toLowerCase()).includes(word)){
      this.setText(currentPlayer, "")
      this.sendMessage(currentPlayer.sessionID, {success: false, message: 'WORD_NOT_FOUND'});
      return 
    }
    
    // Check if hint is in the word (case-insensitive)
    if (!word.includes(this.currentHint.toLowerCase().trim())){
      this.setText(currentPlayer, "")
      this.sendMessage(currentPlayer.sessionID, {success: false, message: 'WORD_NOT_FOUND'});
      return 
    }
    
    // Check if word exists using wordService.checkWord (case-insensitive)
    if (!wordService.checkWord(this.currentHint, this.language, word)) {
      this.setText(currentPlayer, "")
      this.sendMessage(currentPlayer.sessionID, {success: false, message: 'WORD_NOT_FOUND'});
      return 
    }

    // Add word to guessed words
    this.guessedWords.push(word);

    // Decrease timer (This should go based on the length of the word)
    this.timer -= 0.5;

    this.nextTurn();
  }

  nextTurn(failed = false) {
    const newPlayer = this.getNewPlayer();

    if (!failed || this.failedTimes >= this.players.filter(p => p.isReady && p.lives > 0).length) {
      this.failedTimes = 0;
      this.currentHint = wordService.getHint(this.lastHint, this.language, this.diffuculty);
      this.lastHint = this.currentHint;
    }

    this.setText(newPlayer.sessionID, "");

    this.resetTimer();
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

    // Update failed times
    this.failedTimes++;

    // Remove Live
    this.players.find(p => p.currentPlayer === true).lives--;

    if (this.checkWinner())
      return;

    this.nextTurn(true);

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

    this.endTime = Date.now() + (this.timer * 1000);

    this.timerInterval = setTimeout(() => {
      this.NotInTime();
    }, this.timer * 1000); // Convert to milliseconds
  }

  getRemainingTime() {
    if (!this.endTime) {
      return 0; // No timeout has been set
    }
  
    const now = Date.now();
    const remainingTime = this.endTime - now;
  
    return remainingTime > 0 ? remainingTime : 0; // Ensure we don't return negative values
  }

  resetValues() {
    this.gameState = 'lobby';
    this.guessedWords = [];
    this.currentHint = "";
    this.timer = this.defaultTimer;
    this.endTime = null;

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
  
  sendMessage(user, message) {
    const socketService = require("../services/socketService");
    socketService.sendMessage(`${user}-${this.gameID}`, message);
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
      defaultTimer: this.timer,
      remainingTime: this.getRemainingTime(),
      diffuculty: this.diffuculty,
      privateGame: this.privateGame,
      maxPlayers: this.maxPlayers,
    }
  }
}

module.exports = Game;