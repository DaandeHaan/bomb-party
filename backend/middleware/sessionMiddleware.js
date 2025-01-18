const sessionService = require("../services/sessionService");

function checkSessionID(req, res, next) {

  let sessionID = req.cookies.session;

  sessionID = sessionService.validSession(sessionID);
  
  res.cookie('session', sessionID);

  next();
};

module.exports = checkSessionID;