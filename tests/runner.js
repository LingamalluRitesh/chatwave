/**
 * ChatWave 3.0 - Master Automated Test Suite Runner
 */
const stateTest = require('./unit/StateStore.test');
const chessTest = require('./unit/ChessGame.test');
const wordleTest = require('./unit/WordleGame.test');
const serverHealthTest = require('./unit/ServerHealth.test');
const securityHeadersTest = require('./unit/SecurityHeaders.test');
const e2eeTest = require('./unit/E2EEncryption.test');
const webrtcTest = require('./unit/WebRTCChannel.test');
const whiteboardTest = require('./unit/WhiteboardState.test');
const ephemeralAndPollingTest = require('./unit/EphemeralAndPolling.test');

console.log('====================================================');
console.log('  🚀 Running ChatWave 3.0 Automated Test Suites');
console.log('====================================================');

try {
  stateTest();
  chessTest();
  wordleTest();
  serverHealthTest();
  securityHeadersTest();
  e2eeTest();
  webrtcTest();
  whiteboardTest();
  ephemeralAndPollingTest();

  console.log('====================================================');
  console.log('  ✅ ALL 9 TEST SUITES EXECUTED & PASSED (100%)');
  console.log('====================================================');
} catch (err) {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
}
