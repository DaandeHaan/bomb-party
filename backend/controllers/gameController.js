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
      return res.json({success: false, message: 'Game not found'});

    res.json(games.find(game => game.gameID === gameID));

  } else {

    res.json({ success: true, games: games });

  }
});

/*
{
  success: boolean,
  gameID: gameID
}
*/
router.post('/create', (req, res) => {

  const game = new Game({id: '1', name: 'Daan'});

  games.push(game)

  res.json({success: true, gameID: game.gameID});
});

router.post('/message', (req, res) => {

  socketService.sendMessage([socketService.clients[0]], "Hello!");

  res.json({success: true});
});

module.exports = router;