const fs = require('fs');
const path = require('path');
const difficultyThresholds = {
  Beginner: 5000,
  Easy: 2000,
  Medium: 1000,
  Hard: 500,
  Expert: 250,
  Hardcore: 100
};

const language = 'dutch';

function generateHints() {
  console.log('Generating all 2-letter and 3-letter combinations...');
  const hints = [];

  for (let i = 97; i <= 122; i++) { 
    for (let j = 97; j <= 122; j++) {
      hints.push(String.fromCharCode(i) + String.fromCharCode(j));
    }
  }

  for (let i = 97; i <= 122; i++) {
    for (let j = 97; j <= 122; j++) {
      for (let k = 97; k <= 122; k++) {
        hints.push(String.fromCharCode(i) + String.fromCharCode(j) + String.fromCharCode(k));
      }
    }
  }

  return hints;
}

function getWords() {
  return fs.readFileSync(`../languages/${language}/words.txt`, 'utf-8').toLowerCase().split(/\s+/);
}

function saveToFile(file, hint) {
  const outputFolder = path.join(__dirname, 'output');

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const filePath = path.join(outputFolder, file);

  try {
    fs.appendFileSync(filePath, hint + '\n');
    console.log('Data appended successfully to', filePath);
  } catch (err) {
    console.error('Error writing to file:', err);
  }
}

function getOccurances() {
  const hints = generateHints();
  const words = getWords();

  for (const hint of hints) {

    console.log('Checking hint:', hint);

    let count = 0;
    for (const word of words) {
      if (word.includes(hint)) {
        count++;
      }
    }

    if (count <= difficultyThresholds.Beginner && count > difficultyThresholds.Easy) {
      saveToFile('beginner.txt', hint);
    } else if (count <= difficultyThresholds.Easy && count > difficultyThresholds.Medium) {
      saveToFile('easy.txt', hint);
    } else if (count <= difficultyThresholds.Medium && count > difficultyThresholds.Hard) {
      saveToFile('medium.txt', hint);
    } else if (count <= difficultyThresholds.Hard && count > difficultyThresholds.Expert) {
      saveToFile('hard.txt', hint);
    } else if (count <= difficultyThresholds.Expert && count > difficultyThresholds.Hardcore) {
      saveToFile('expert.txt', hint);
    } else if (count <= difficultyThresholds.Hardcore) {
      saveToFile('hardcore.txt', hint);
    }
  }
}

getOccurances();
