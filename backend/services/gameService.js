class Game {
  constructor(gameOwner) {
    this.players = [gameOwner]; // Object: {id: string, name: string}
    this.gameOwner = gameOwner;
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