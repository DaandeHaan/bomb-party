const sessionService = require("../services/sessionService");

function checkSessionID(req, res, next) {

  let sessionID = req.cookies.session;

  sessionID = sessionService.validSession(sessionID);

  // Initialize the user object
  req.user = req.user || {};
  req.user.sessionID = sessionID;
  
  res.cookie('session', sessionID);

  next();
};

module.exports = checkSessionID;