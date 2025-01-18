const { v4: uuidv4 } = require('uuid'); // To generate unique IDs

class userService {
 
  validSession(sessionID) {
    // Check if the session is valid
    if (sessionID)
      return sessionID;

    // If not return a sessionID
    return uuidv4(); // Generate a unique ID
  }


}

module.exports = new userService();