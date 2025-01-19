const fs = require('fs');
const path = require('path');

class wordService {

  getHint(language, difficulty) {
    const hints = this.readHintsFile(language, difficulty);

    // Choose random hint
    const hint = hints[Math.floor(Math.random() * hints.length)];

    return hint;    
  }

  checkWord(hint, language, word) {
    const words = this.readWordsFile(language);
    
    // Check if word contains hint
    if (!word.includes(hint))
      return false
    
    // Check if word is in the list of words
    if (!words.some(w => w.toLowerCase() === word.toLowerCase()))
      return false;
    
    return true;
  }

  // This function returns a array of hints in the file
  readHintsFile(language, difficulty) {
    
    const hintsFile = path.join(__dirname, '../languages', language, "hints", difficulty + ".txt");

    // Check if file exists
    if (!fs.existsSync(hintsFile)) {
      console.error(`File ${hintsFile} does not exist`);
      return [];
    }

    const hints = fs.readFileSync(hintsFile, 'utf8');
    return hints.split('\n');
  }

  readWordsFile(language) {
    
    const wordsFile = path.join(__dirname, '../languages', language, "words.txt");

    // Check if file exists
    if (!fs.existsSync(wordsFile)) {
      console.error(`File ${wordsFile} does not exist`);
      return [];
    }

    const words = fs.readFileSync(wordsFile, 'utf8');
    return words.split('\n');
  }

}

module.exports = new wordService();