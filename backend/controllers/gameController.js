// Express router
const express = require('express');
const Game = require('../services/gameService');
const socketService = require('../services/socketService');

const router = express.Router();

const games = [];

router.get('/:gameID?', (req, res) => {
  const gameID = req.params.gameID;

  if (gameID) {

    const game = games.find(game => game.gameID === gameID);

    if (!game)
      return res.statusCode(404).json({success: false, message: 'Game not found'});

    res.json(games.find(game => game.gameID === gameID));

  } else {

    res.json({ success: true, games: games });

  }
});

router.post('/join/:gameID', (req, res) => {
  
  const gameID = req.params.gameID;

  if (!gameID)
    return res.statusCode(400).json({success: false, message: 'No gameID provided'});

  const game = games.find(game => game.gameID === gameID);

  if (!game)
    return res.statusCode(404).json({success: false, message: 'Game not found'});

  game.addPlayer(req.body.user);

  // Start webSocket

  res.json({success: true});
});

router.post('/create', (req, res) => {

  // Change to const
  let body = req.body;

  body.user = {
    id: "1",
    name: "Test"
  }

  const game = new Game(body.user);

  games.push(game)

  res.json({success: true, gameID: game.gameID});
});

router.post('/message', (req, res) => {

  socketService.sendMessage([socketService.clients[0]], "Hello!");

  res.json({success: true});
});

module.exports = router;