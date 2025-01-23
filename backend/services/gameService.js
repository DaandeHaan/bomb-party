const Game = require('../models/game.js');

class GameManager {
  constructor() {
    this.games = [];
  }

  createGame(config) {

    let difficulty = 'easy'
    let language = 'dutch'
    let maxPlayers = 8;

    if (['baby', 'beginner', 'easy', 'medium', 'hard', 'expert', 'hardcore'].includes(config.difficulty))
      difficulty = config.difficulty;

    if (['dutch', 'english'].includes(config.language))
      language = config.language;

    if (config.maxPlayers && config.maxPlayers > 1 && config.maxPlayers <= 8)
      maxPlayers = config.maxPlayers;

    const settings = {
      diffuculty: difficulty,
      language: language,
      privateGame: config.privateGame || false,
      maxPlayers: maxPlayers,
      defaultTimer: config.timer || 10,      
    }

    const game = new Game(settings);
    this.games.push(game);
    return game;
  }

  getGame(gameID) {
    return this.games.find(game => game.gameID === gameID);
  }

  getGames() {
    let games = [];
    for (const game of this.games) {
      if (!game.privateGame)
        games.push(game);
    }
    return games;
  }

  deleteGame(gameID) {
    this.games = this.games.filter(game => game.gameID !== gameID);
  }
}

module.exports = new GameManager()