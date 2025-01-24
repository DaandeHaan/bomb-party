const { v4: uuidv4 } = require('uuid'); // To generate unique IDs
const fs = require('fs');
const path = require('path');

class sessionService {
 
  validSession(sessionID) {
    // Check if the session is valid
    if (sessionID)
      return sessionID;

    // If not return a sessionID
    return uuidv4(); // Generate a unique ID
  }

  getRandomUsername() {
    const data = fs.readFileSync(path.resolve(__dirname, '../data/usernames.txt'), 'utf8');

    const usernames = data.split('\n');
    const userName = usernames[Math.floor(Math.random() * usernames.length)];
    return userName;
  }


}

module.exports = new sessionService();