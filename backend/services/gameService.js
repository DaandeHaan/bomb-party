const Logger = require('../logs/logger.js');
const Game = require('../models/game.js');

class GameManager {
  constructor() {
    this.games = [];
  }

  createGame(config) {

    let difficulty = 'easy'
    let language = 'dutch'
    let maxPlayers = 8;
    let timer = 10;
    let lives = 2;

    if (['baby', 'beginner', 'easy', 'medium', 'hard', 'expert', 'hardcore'].includes(config.difficulty))
      difficulty = config.difficulty;

    if (['dutch', 'english'].includes(config.language))
      language = config.language;

    if (config.maxPlayers && config.maxPlayers > 1 && config.maxPlayers <= 8)
      maxPlayers = config.maxPlayers;

    if (config.defaultTimer && !isNaN(config.defaultTimer) && config.defaultTimer > 0)
      timer = config.defaultTimer;

    if (config.lives && !isNaN(config.lives) && config.lives > 0)
      lives = config.lives;


    const settings = {
      diffuculty: difficulty,
      language: language,
      privateGame: config.privateGame || false,
      maxPlayers: maxPlayers,
      defaultTimer: timer,      
      lives: lives,
    }

    const game = new Game(settings);
    this.games.push(game);

    Logger.log(`[${game.gameID}] [xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx] Game created with settings: ${JSON.stringify(settings)}`);

    return game;
  }

  getGame(gameID) {
    return this.games.find(game => game.gameID === gameID);
  }

  getGames() {
    let games = [];
    for (const game of this.games) {
      if (!game.privateGame)
        games.push(game.getGame());
    }
    return games;
  }

  deleteGame(gameID) {
    Logger.log(`[${gameID}] [xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx] Game deleted`);
    this.games = this.games.filter(game => game.gameID !== gameID);
  }

  cleanUp() {
    const gamesToDelete = this.games.filter(game => game.players.length === 0);
    for (const game of gamesToDelete) {
      Logger.log(`[${game.gameID}] [xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx] Game deleted due to inactivity`);
      this.deleteGame(game.gameID);
    }
  }

  
}

module.exports = new GameManager();