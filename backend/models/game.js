const Logger = require("../logs/logger");
const wordService = require("../services/wordService");
const Player = require("./player");

class Game {
  constructor(settings) {
    this.gameID = Array.from({ length: 4 }, () => 
      String.fromCharCode(97 + Math.floor(Math.random() * 26)) // Random letter from a-z
    ).join('').toUpperCase(); // Random 4-letter string

    // Settings
    this.diffuculty = settings.diffuculty; // baby, beginner, easy, medium, hard, expert, hardcore
    this.language = settings.language;
    this.defaultTimer = settings.defaultTimer;
    this.privateGame = settings.privateGame; // Show in lobby or not
    this.maxPlayers = settings.maxPlayers;
    this.lives = settings.lives;

    // Game Variables
    this.gameState = 'lobby';
    this.players = [];
    this.currentHint = "";	
    this.guessedWords = [];
    this.timer = this.defaultTimer;
    this.currentText = "";
    
    // Helper Variables
    this.endTime = null;
    this.timerInterval = null;
    this.lastHint = "";
    this.failedTimes = 0;
    this.startGameInTimer = null;
  }

  addPlayerToGame(sessionID, username) {

    // Check if the game is full
    if (this.players.length >= this.maxPlayers)
      return false;

    // Check if player is already in the game
    if (this.players.find(p => p.sessionID === sessionID))
      return false;

    const player = new Player(sessionID, username, this.lives);

    this.players.push(player);
    
    // Get the first player as owner
    this.players[0].isOwner = true;
    
    this.sendGameObject();

    this.sendMessage(this.players.map(player => player.sessionID), {type: 'PLAYER_JOINED', id: player.id, username: player.username});

    Logger.log(`[${this.gameID}] [${player.id}] Joined the game (${this.players.length}/${this.maxPlayers})`);

    return true;

  }

  removePlayerFromGame(sessionID) {

    // Get the player
    const player = this.players.find(p => p.sessionID === sessionID);

    // Check if the player was the current player
    if (player.currentPlayer)
      this.nextTurn();

    this.players = this.players.filter(p => p.sessionID !== sessionID);

    if (this.players.length === 0)
      return;

    // Check the amount of players that are ready, if 1 or less, cancel the game
    if (this.players.filter(p => p.isReady).length <= 1) {
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'CANCEL_STARTING_GAME_TIMER'});
      clearTimeout(this.startGameInTimer);
    }


    this.checkWinner();

    this.players[0].isOwner = true;

    this.sendGameObject();

    Logger.log(`[${this.gameID}] [${player.id}] Left the game (${this.players.length}/${this.maxPlayers})`);

    this.sendMessage(this.players.map(player => player.sessionID), {type: 'PLAYER_LEFT', id: player.id, username: player.username});
  }

  readyUp(player) {

    if (this.gameState !== 'lobby')
      return false;

    // Check if player is already in the game
    const foundPlayer = this.players.find(p => p.sessionID === player)
    
    if (!foundPlayer)
      return false;

    if (foundPlayer.isReady) {
      foundPlayer.isReady = false;
      Logger.log(`[${this.gameID}] [${foundPlayer.id}] Set their status to unready! (${this.players.filter(p => p.isReady).length}/${this.players.length})`);
    } else {
      foundPlayer.isReady = true;
      Logger.log(`[${this.gameID}] [${foundPlayer.id}] Set their status to ready! (${this.players.filter(p => p.isReady).length}/${this.players.length})`);
    }

    // Check if 2 players or more are ready
    if (this.players.filter(p => p.isReady).length >= 2) {
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'STARTING_GAME_TIMER'});
      this.startGameInTimer = setTimeout(() => {
        this.startGame();
      }, 15000);
    } else  {
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'CANCEL_STARTING_GAME_TIMER'});
      clearTimeout(this.startGameInTimer);
    }


    return true;
  }

  startGame() {
    if (this.gameState !== 'lobby')
      return;

    if (this.players.filter(p => p.isReady).length < 2)
      return this.sendMessage(this.players.find(p => p.isOwner).sessionID, {type: 'NOT_ENOUGH_PLAYERS'});

    this.gameState = 'playing';

    // Assuming this.players is an array of player objects
    const readyPlayers = this.players.filter(player => player.isReady === true);

    // Select a random player from the readyPlayers array
    const randomPlayer = readyPlayers[Math.floor(Math.random() * readyPlayers.length)];

    // Set the currentPlayer to true for the selected random player
    if (randomPlayer) {
      randomPlayer.currentPlayer = true;
    }

    this.currentHint = wordService.getHint(this.lastHint, this.language, this.diffuculty, this.gameID).toLowerCase().trim();
    this.lastHint = this.currentHint;
    this.guessedWords = [];
    this.timer = this.defaultTimer;

    this.startTimer();

    this.sendMessage(this.players.map(player => player.sessionID), {type: 'GAME_STARTED'});

    Logger.log(`[${this.gameID}] [xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx] Game started with ${this.players.filter(p => p.isReady).length} players!`);

    this.sendGameObject();
  }

  checkWinner() {

    if (this.gameState !== 'playing')
      return false;

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

    winner.wins++;

    clearTimeout(this.timerInterval);

    this.sendGameObject();

    this.sendMessage(winner.sessionID, {type: 'GAME_FINISHED_WON', id: winner.id});

    const losers = this.players.map(player => player.sessionID).filter(sessionID => sessionID !== winner.id);

    Logger.log(`[${this.gameID}] [${winner.id}] Has won!`);

    this.sendMessage(losers, { type: 'GAME_FINISHED_LOST', losers: losers }
    );

    return true;
  }

  setText(sessionID, text) {

    if (this.gameState !== 'playing')
      return;

    const player = this.players.find(p => p.sessionID === sessionID);

    if (!player)
      return;

    player.currentText = text;
    this.currentText = text;
  }

  guessWord(word) {

    if (this.gameState !== 'playing')
      return;

    word = word.toLowerCase().trim()

    const currentPlayer = this.players.find(p => p.currentPlayer === true);

    // Check if word has already been guessed
    if (this.guessedWords.map(w => w.toLowerCase()).includes(word)){
      this.setText(currentPlayer, "")
      this.currentText = "";
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'WORD_NOT_FOUND', id: this.players.find(p => p.currentPlayer === true).id});
      Logger.log(`[${this.gameID}] [${currentPlayer.id}] Guessed '${word}' but this word has already been guessed (HINT: ${this.currentHint})`);
      return 
    }
    
    // Check if hint is in the word (case-insensitive)
    if (!word.includes(this.currentHint.toLowerCase().trim())){
      this.setText(currentPlayer, "")
      this.currentText = "";
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'WORD_NOT_FOUND', id: this.players.find(p => p.currentPlayer === true).id});
      Logger.log(`[${this.gameID}] [${currentPlayer.id}] Guessed '${word}' but it does not contain the hint '${this.currentHint}'`);
      return 
    }
    
    // Check if word exists using wordService.checkWord (case-insensitive)
    if (!wordService.checkWord(this.currentHint, this.language, word)) {
      this.setText(currentPlayer, "")
      this.currentText = "";
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'WORD_NOT_FOUND', id: this.players.find(p => p.currentPlayer === true).id});
      Logger.log(`[${this.gameID}] [${currentPlayer.id}] Guessed '${word}' but its not a valid word (HINT: ${this.currentHint})`);
      return 
    }

    let randomPercentage = (Math.random() * 4 + 1) / 100; // Between 1 and 5%

    if (word.length >= 10) {
      randomPercentage = (Math.random() * 0.1 + 0.1); // Between 10 and 20%
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'EXCELENT_WORD_FOUND', id: this.players.find(p => p.currentPlayer === true).id, word: word});
      Logger.log(`[${this.gameID}] [${currentPlayer.id}] Guessed '${word}', which is an excellent word!`);
    } else {
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'WORD_FOUND', id: this.players.find(p => p.currentPlayer === true).id, word: word});
      Logger.log(`[${this.gameID}] [${currentPlayer.id}] Guessed '${word}', which is correct!`);
    }

    // Add word to guessed words
    this.guessedWords.push(word);

    // Decrease timer
    this.timer -= this.timer * randomPercentage;

    // Ensure timer doesn't go below 1
    this.timer = Math.max(1, this.timer);

    this.nextTurn();

    Logger.log(`[${this.gameID}] [xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx] The timer is now at ${this.timer.toFixed(2)} seconds`);

    return true;
  }

  nextTurn(failed = false) {
    const newPlayer = this.getNewPlayer();

    if (!failed || this.failedTimes >= this.players.filter(p => p.isReady && p.lives > 0).length) {
      this.failedTimes = 0;
      this.currentHint = wordService.getHint(this.lastHint, this.language, this.diffuculty, this.gameID);
      this.lastHint = this.currentHint;
    }

    this.setText(newPlayer.sessionID, "");
    this.currentText = "";

    this.resetTimer();
  }

  getNewPlayer() {
    let currentPlayer = this.players.findIndex(p => p.currentPlayer === true);
    this.players[currentPlayer].currentPlayer = false;

    // Get the next player (that is ready and has lives)
    let nextPlayer = this.players[(currentPlayer + 1) % this.players.length];

    while (!nextPlayer.isReady || nextPlayer.lives === 0) {

      currentPlayer = this.players.findIndex(p => p.sessionID === nextPlayer.sessionID);
      nextPlayer = this.players[(currentPlayer + 1) % this.players.length];
    }

    nextPlayer.currentPlayer = true;
    return nextPlayer;
  }

  NotInTime() {

    // Check if the current user's text is still a valid word
    if (this.guessWord(this.players.find(p => p.currentPlayer === true).currentText)) 
      return this.sendGameObject();


    // Reset Timer
    this.timer = this.defaultTimer;

    // Update failed times
    this.failedTimes++;

    const currentPlayer = this.players.find(p => p.currentPlayer === true);

    // Remove Live
    currentPlayer.lives--;

    if (currentPlayer.lives === 0) {
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'PLAYER_DIED', id: currentPlayer.id});
      Logger.log(`[${this.gameID}] [${currentPlayer.id}] Died because they did not guess the word in time.`);
    } else {
      this.sendMessage(this.players.map(player => player.sessionID), {type: 'LIVE_LOST', id: currentPlayer.id});
      Logger.log(`[${this.gameID}] [${currentPlayer.id}] Did not guess the word in time. (${currentPlayer.lives} lives remaining)`);
    }

    if (this.checkWinner())
      return;

    this.nextTurn(true);
    Logger.log(`[${this.gameID}] [xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx] Timer is now at ${this.timer.toFixed(2)} seconds`);

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

  resetValues() {
    this.gameState = 'lobby';
    this.guessedWords = [];
    this.currentHint = "";
    this.timer = this.defaultTimer;
    this.endTime = null;
    this.currentText = "";

    this.players.forEach(p => {
      p.isReady = false;
      p.currentPlayer = false;
      p.currentText = "";
      p.lives = this.lives;
    });
  }

  sendGameObject() {
    const socketService = require("../services/socketService");
    socketService.sendGameObject(this);
  }
  
  sendMessage(user, message) {
    const socketService = require("../services/socketService");

    if (Array.isArray(user)) {
      for (const u of user) {
        socketService.sendMessage(`${u}-${this.gameID}`, message);
      }

      return;
    }

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
      timer: this.timer,
      diffuculty: this.diffuculty,
      privateGame: this.privateGame,
      maxPlayers: this.maxPlayers,
      lives: this.lives,
      currentText: this.currentText,
      defaultLives: this.lives,
    }
  }
}

module.exports = Game;