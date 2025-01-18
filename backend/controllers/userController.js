const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

router.get('/session', (req, res) => {

  // Extract session from cookies
  let sessionID = req.cookies.session;

  // Check if the session is valid
  sessionID = userService.validSession(sessionID);

  // Set the session cookie
  res.cookie('session', sessionID);
  res.json({ success: true });

});

module.exports = router;