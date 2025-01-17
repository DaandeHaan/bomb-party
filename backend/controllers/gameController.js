// Express router
const express = require('express');
const Game = require('../services/gameService');

const router = express.Router();

const games = [];

router.post('/create', (req, res) => {

  const game = new Game({id: '1', name: 'Daan'});

  games.push(game)

  res.json({success: true, message: "Game created"});
});

router.get('/game', (req, res) => {
  res.json({success: true, games: games});
});

module.exports = router;