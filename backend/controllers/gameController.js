// Express router
const express = require('express');
const Game = require('../services/gameService');
const socketService = require('../services/socketService');
const wordService = require('../services/wordService');

const router = express.Router();

const games = [];





router.post('/create', (req, res) => {

  const user = {
    sessionID: req.user.sessionID,
    name: req.body.username
  }

  const game = new Game({ gameOwner: user });

  games.push(game)

  res.json({success: true, gameID: game.gameID, webSocket: 'ws://localhost:3000/connect?sessionID=' + req.user.sessionID});
});

router.post('/message', (req, res) => {

  socketService.sendMessage([socketService.clients[0]], "Hello!");

  res.json({success: true});
});



router.post('/:gameID/join/', (req, res) => {
  
  const gameID = req.params.gameID;

  if (!gameID)
    return res.status(400).json({success: false, message: 'No gameID provided'});

  const game = games.find(game => game.gameID === gameID);

  if (!game)
    return res.status(404).json({success: false, message: 'Game not found'});

  const user = {
    sessionID: req.user.sessionID,
    name: req.body.username
  }

  if (!game.addPlayer(user))
    return res.json({success: false, message: 'User already in game'});

  res.json({success: true, game: game, webSocket: 'ws://localhost:3000/connect?sessionID=' + req.user.sessionID});
});

router.get('/:gameID?', (req, res) => {
  const gameID = req.params.gameID;

  if (gameID) {

    const game = games.find(game => game.gameID === gameID);

    if (!game)
      return res.status(404).json({success: false, message: 'Game not found'});

    res.json(games.find(game => game.gameID === gameID));

  } else {

    res.json({ success: true, games: games });

  }
});

router.post('/debug', (req, res) => {
  const hint = wordService.getHint('dutch', 'beginner');
  res.json({success: true, hint: hint});
});

router.post('/debug2', (req, res) => {
  const hint = wordService.getHint('dutch', 'beginner');
  res.json({success: true, hint: hint});
});

module.exports = router;