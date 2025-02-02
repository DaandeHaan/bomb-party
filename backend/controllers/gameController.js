const express = require('express');
const GameManager= require('../services/gameService');
const sessionService = require('../services/sessionService');

const router = express.Router();

router.post('/create', (req, res) => {

  if (!req.body.settings)
    return res.status(400).json({success: false, message: 'No settings provided'});

  const game = GameManager.createGame(req.body.settings);

  res.json({success: true, gameID: game.gameID});
});

router.post('/:gameID/connect/', (req, res) => {
  
  const gameID = req.params.gameID;

  if (!gameID)
    return res.status(400).json({success: false, message: 'No gameID provided'});

  const game = GameManager.getGame(gameID)

  if (!game)
    return res.status(404).json({success: false, message: 'Game not found'});

  if (game.players.length >= game.maxPlayers)
    return res.status(400).json({success: false, message: 'Game is full'});

  // Check if there is a username provided
  username = req.body.username
  if (!username)
    username = sessionService.getRandomUsername();

  // While the username is already taken, get a new one
  while (game.players.find(player => player.username === username))
    username = sessionService.getRandomUsername();
    

  res.json({success: true, game: game.getGame, webSocket: 'ws://localhost:8080/connect?sessionID=' + req.user.sessionID + '&gameID=' + gameID + "&username=" + username});
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

module.exports = router;