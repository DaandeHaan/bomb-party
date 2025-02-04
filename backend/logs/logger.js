const path = require('path');
const fs = require('fs');

class Logger {
  constructor() {
    this.filePath = path.join(__dirname, 'logs.log');
  }

  log(message) {

    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const logMessage = `[${date}] ${message}\n`;

    // When the file does not exist, create it
    if (!fs.existsSync(this.filePath))
      fs.writeFileSync(this.filePath, '', (err) => {
        if (err)
          console.log(err);
      }
    );

    fs.appendFile(this.filePath, logMessage, (err) => {
      if (err)
        console.log(err);
    });
  }
}

module.exports = new Logger();