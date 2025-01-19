const express = require('express');
const { Game, GameManager}= require('../services/gameService');
const socketService = require('../services/socketService');
const wordService = require('../services/wordService');

const router = express.Router();

router.post('/create', (req, res) => {

  const game = GameManager.createGame();

  res.json({success: true, gameID: game.gameID});
});

router.post('/:gameID/connect/', (req, res) => {
  
  const gameID = req.params.gameID;

  if (!gameID)
    return res.status(400).json({success: false, message: 'No gameID provided'});

  const game = GameManager.getGame(gameID)

  if (!game)
    return res.status(404).json({success: false, message: 'Game not found'});

  res.json({success: true, game: game, webSocket: 'ws://localhost:8080/connect?sessionID=' + req.user.sessionID + '&gameID=' + gameID + "&username=" + req.body.username});
});

router.get('/:gameID?', (req, res) => {
  const gameID = req.params.gameID;

  if (gameID) {

    const game = GameManager.getGame(gameID)

    if (!game)
      return res.status(404).json({success: false, message: 'Game not found'});

    res.json(game);

  } else {

    res.json({ success: true, games: GameManager.getGames() });

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