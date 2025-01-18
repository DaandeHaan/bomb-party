const fs = require('fs');
const path = require('path');

class wordService {

  getHint(language, difficulty) {
    const hints = this.readFile(language, difficulty);

    console.log(hints);

    // Choose random hint
    const hint = hints[Math.floor(Math.random() * hints.length)];

    console.log("Hint: " + hint);

    return hint;    
  }

  checkWord(hint, language, difficulty, word) {
    const hints = this.readFile(language, difficulty);

    // Check if word is in hints
    return hints.includes(word);
  }

  // This function returns a array of hints in the file
  readFile(language, difficulty) {
    
    const hintsFile = path.join(__dirname, '../languages', language, "hints", difficulty + ".txt");

    // Check if file exists
    if (!fs.existsSync(hintsFile)) {
      console.error(`File ${hintsFile} does not exist`);
      return [];
    }

    const hints = fs.readFileSync(hintsFile, 'utf8');
    return hints.split('\n');
  }

}

module.exports = new wordService();