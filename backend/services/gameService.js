const Game = require('../models/game.js');

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

module.exports = new GameManager()