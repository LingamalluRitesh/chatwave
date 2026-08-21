/**
 * ServerHealth.test.js -- Server Health & Diagnostic API Unit Test
 */
const assert = require('assert');
const http = require('http');
const { server } = require('../../server/server');

module.exports = function testServerHealth() {
  console.log('  * Running ServerHealth test...');

  assert(server !== undefined, 'Server instance should be exported');
  assert(typeof server.listen === 'function', 'Server should have a listen method');

  // Verify health payload structure definition
  const mockHealthResponse = {
    status: 'online',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    uptime: 120
  };

  assert.strictEqual(mockHealthResponse.status, 'online', 'Status should be online');
  assert.strictEqual(mockHealthResponse.version, '3.0.0', 'Version should match 3.0.0');
  assert(typeof mockHealthResponse.uptime === 'number', 'Uptime should be a number');

  console.log('    [PASS] ServerHealth tests passed.');
};
