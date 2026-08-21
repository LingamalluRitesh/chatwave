/**
 * Unit Test: WordleGame
 */
const assert = require('assert');
const WordleGame = require('../../src/components/MiniApps/WordleGame');

function run() {
  console.log('Testing Wordle Game...');
  WordleGame.reset();
  assert.strictEqual(WordleGame.gameStatus, 'IN_PROGRESS', 'Wordle game is in progress');
  assert.strictEqual(WordleGame.guesses.length, 0, 'No guesses made initially');
  console.log('? Wordle Game tests passed!');
}

module.exports = run;
