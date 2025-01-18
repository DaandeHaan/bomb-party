const express = require('express');
const sessionService = require('../services/sessionService');

const router = express.Router();

router.get('/', (req, res) => {

  // Extract session from cookies
  let sessionID = req.cookies.session;

  // Check if the session is valid
  sessionID = sessionService.validSession(sessionID);

  // Set the session cookie
  res.cookie('session', sessionID);
  res.json({ success: true });

});

module.exports = router;