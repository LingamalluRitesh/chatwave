const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, '../tests');
const unitDir = path.join(testsDir, 'unit');
[testsDir, unitDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. unit/StateStore.test.js
const stateTest = `/**
 * Unit Test: StateStore
 */
const assert = require('assert');
const StateStore = require('../../src/core/StateStore');

function run() {
  console.log('Testing StateStore...');
  StateStore.setCurrentUser({ id: 'test_1', name: 'Tester' });
  const user = StateStore.get('currentUser');
  assert.strictEqual(user.id, 'test_1', 'User ID matches');
  assert.strictEqual(user.name, 'Tester', 'User Name matches');

  StateStore.setActiveChat('chat_123', 'direct');
  assert.strictEqual(StateStore.get('activeChatId'), 'chat_123', 'Active Chat ID matches');
  console.log('? StateStore tests passed!');
}

module.exports = run;
`;
fs.writeFileSync(path.join(unitDir, 'StateStore.test.js'), stateTest);

// 2. unit/ChessGame.test.js
const chessTest = `/**
 * Unit Test: ChessGame
 */
const assert = require('assert');
const ChessEngine = require('../../src/components/MiniApps/ChessGame');

function run() {
  console.log('Testing Chess Engine...');
  ChessEngine.reset();
  assert.strictEqual(ChessEngine.turn, 'w', 'White starts first');
  const moves = ChessEngine.calculateMoves(6, 4); // Pawn at e2
  assert.strictEqual(moves.length, 2, 'Pawn has 2 valid opening moves');
  console.log('? Chess Engine tests passed!');
}

module.exports = run;
`;
fs.writeFileSync(path.join(unitDir, 'ChessGame.test.js'), chessTest);

// 3. unit/WordleGame.test.js
const wordleTest = `/**
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
`;
fs.writeFileSync(path.join(unitDir, 'WordleGame.test.js'), wordleTest);

// 4. runner.js
const runnerContent = `/**
 * ChatWave 3.0 - Automated Test Suite Runner
 */
const stateTest = require('./unit/StateStore.test');
const chessTest = require('./unit/ChessGame.test');
const wordleTest = require('./unit/WordleGame.test');

console.log('====================================');
console.log('?? Running ChatWave 3.0 Test Suites');
console.log('====================================');

try {
  stateTest();
  chessTest();
  wordleTest();
  console.log('====================================');
  console.log('?? ALL TEST SUITES PASSED (100%)');
  console.log('====================================');
} catch (err) {
  console.error('? Test suite failed:', err);
  process.exit(1);
}
`;
fs.writeFileSync(path.join(testsDir, 'runner.js'), runnerContent);
console.log('Created test suites and runner.js');
