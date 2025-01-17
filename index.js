const fs = require('fs');
const readline = require('readline');

// Read words from .txt file
function loadWords(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject('Error reading the file.');
        return;
      }
      const words = data.split('\n').map(word => word.trim().toLowerCase()).filter(word => word.length > 0);
      resolve(words);
    });
  });
}

// Game class
class BombPartyGame {
  constructor(words) {
    this.words = words;
    this.currentWord = '';
    this.players = [];
    this.timer = null;
    this.timeLeft = 10;
  }

  // Start the game
  start() {
    console.log('Bomb Party Game started!');

    this.chooseWord();
    this.startTimer();
  }

  // Choose a random word from the loaded words
  chooseWord() {
    const randomIndex = Math.floor(Math.random() * this.words.length);
    this.currentWord = this.words[randomIndex];
    console.log(`Current word: ${this.currentWord}`);
  }

  // Start countdown timer
  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft <= 0) {
        console.log('Time\'s up! The bomb exploded!');
        this.endGame();
      } else {
        console.log(`Time left: ${this.timeLeft} seconds`);
        this.timeLeft--;
      }
    }, 1000);
  }

  // Add player
  addPlayer(playerName) {
    this.players.push(playerName);
    console.log(`${playerName} has joined the game.`);
  }

  // Check if a word is correct
  checkWord(word) {
    if (word.toLowerCase() === this.currentWord) {
      console.log(`Correct! The word was "${this.currentWord}".`);
      this.chooseWord(); // Choose a new word
      this.timeLeft = 10; // Reset timer
    } else {
      console.log(`Incorrect word! You entered: ${word}`);
    }
  }

  // End game
  endGame() {
    clearInterval(this.timer);
    console.log('Game Over!');
    console.log('Players: ', this.players.join(', '));
  }
}

// Game Interface
async function startGame() {
  const filePath = './words.txt'; // Path to words file

  // Load words from file
  try {
    const words = await loadWords(filePath);
    const game = new BombPartyGame(words);

    // Setup readline interface for user input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Add some players
    rl.question('Enter player name: ', playerName => {
      game.addPlayer(playerName);
      game.start(); // Start the game after adding the first player

      // Continuously check for player input
      rl.on('line', (input) => {
        if (input === 'exit') {
          game.endGame();
          rl.close();
        } else {
          game.checkWord(input);
        }
      });
    });
  } catch (err) {
    console.log('Error: ', err);
  }
}

startGame();
