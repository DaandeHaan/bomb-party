// Express router
const express = require('express');
const Game = require('../services/gameService');

const router = express.Router();

const games = [];

router.get('/', (req, res) => {
  res.json({success: true, games: games});
});

router.post('/create', (req, res) => {

  const game = new Game({id: '1', name: 'Daan'});

  games.push(game)

  res.json({success: true, gameID: game.gameID});
});

module.exports = router;