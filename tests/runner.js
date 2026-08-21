/**
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
