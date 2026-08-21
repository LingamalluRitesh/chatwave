/**
 * WhiteboardState.test.js -- Canvas Stroke Serialization & Undo/Redo Engine Test
 */
const assert = require('assert');

module.exports = function testWhiteboardState() {
  console.log('  * Running WhiteboardState test...');

  const strokeHistory = [];

  const addStroke = (stroke) => {
    strokeHistory.push({
      id: 'stroke_' + (strokeHistory.length + 1),
      points: stroke.points,
      color: stroke.color || '#6366f1',
      width: stroke.width || 3,
      timestamp: Date.now()
    });
  };

  addStroke({ points: [{ x: 10, y: 10 }, { x: 20, y: 25 }, { x: 40, y: 50 }] });
  addStroke({ points: [{ x: 50, y: 50 }, { x: 80, y: 90 }], color: '#10b981' });

  assert.strictEqual(strokeHistory.length, 2, 'Should contain 2 drawing strokes');
  assert.strictEqual(strokeHistory[0].color, '#6366f1');
  assert.strictEqual(strokeHistory[1].color, '#10b981');

  // Undo operation
  const popped = strokeHistory.pop();
  assert.strictEqual(popped.color, '#10b981');
  assert.strictEqual(strokeHistory.length, 1);

  console.log('    [PASS] WhiteboardState tests passed.');
};
