const sessionService = require("../services/sessionService");

function checkSessionID(req, res, next) {

  let sessionID = req.cookies.sessionID;

  console.log('sessionID', sessionID);

  sessionID = sessionService.validSession(sessionID);

  // Initialize the user object
  req.user = req.user || {};
  req.user.sessionID = sessionID;
  
  res.cookie('sessionID', sessionID);

  next();
};

module.exports = checkSessionID;