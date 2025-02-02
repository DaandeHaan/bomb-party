const cron = require('node-cron');
const gameService = require('../services/gameService');

// Run every minute to delete empty games
cron.schedule('* * * * *', () => {
  gameService.cleanUp();
});