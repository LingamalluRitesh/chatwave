/**
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
