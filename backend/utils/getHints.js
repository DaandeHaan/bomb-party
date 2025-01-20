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

const language = 'english'

function generateHints() {
  console.log('Generating all 2-letter and 3-letter combinations...');
  const hints = [];
  
  // 2-letter combinations (aa to zz)
  for (let i = 97; i <= 122; i++) {  // 'a' to 'z'
    for (let j = 97; j <= 122; j++) {
      hints.push(String.fromCharCode(i) + String.fromCharCode(j));
    }
  }
  
  // 3-letter combinations (aaa to zzz)
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
  // Read file and split into array of words
  return fs.readFileSync(`../languages/${language}/words.txt`, 'utf-8').toLowerCase().split(/\s+/);
}

function saveToFile(file, hint) {
  // Define the output folder
  const outputFolder = path.join(__dirname, 'output');

  // Ensure the output folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  // Define the full path to the file
  const filePath = path.join(outputFolder, file);

  // Append the hint to the file synchronously
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
    console.log(`Checking hint: ${hint}`);

    // Check how many times the hint occurs in the words
    let count = 0;
    for (const word of words) {
      if (word.includes(hint)) {
        count++;
      }
    }

    if (count > difficultyThresholds.Beginner) {
      console.log('Beginner hint:', hint);
      saveToFile('beginner.txt', hint);
    }

    if (count > difficultyThresholds.Easy) {
      console.log('Easy hint:', hint);
      saveToFile('easy.txt', hint);
    }

    if (count > difficultyThresholds.Medium) {
      console.log('Medium hint:', hint);
      saveToFile('medium.txt', hint);
    }

    if (count > difficultyThresholds.Hard) {
      console.log('Hard hint:', hint);
      saveToFile('hard.txt', hint);
    }

    if (count > difficultyThresholds.Expert) {
      console.log('Expert hint:', hint);
      saveToFile('expert.txt', hint);
    }

    if (count > difficultyThresholds.Hardcore) {
      console.log('Hardcore hint:', hint);
      saveToFile('hardcore.txt', hint);
    }
  }
}

getOccurances();
