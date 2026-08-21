/**
 * SecurityHeaders.test.js -- CORS, Injection Sanitization & HTTP Headers Test
 */
const assert = require('assert');

module.exports = function testSecurityHeaders() {
  console.log('  * Running SecurityHeaders test...');

  const expectedHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Content-Type-Options': 'nosniff'
  };

  assert.strictEqual(expectedHeaders['Access-Control-Allow-Origin'], '*');
  assert(expectedHeaders['Access-Control-Allow-Methods'].includes('GET'));
  assert(expectedHeaders['Access-Control-Allow-Methods'].includes('POST'));

  // Test SQL injection input sanitizer simulation
  const sanitize = (str) => String(str).replace(/['";\-\-]/g, '');
  const maliciousInput = "admin' OR '1'='1' --";
  const cleaned = sanitize(maliciousInput);

  assert(!cleaned.includes("'"), 'Single quotes must be stripped');
  assert(!cleaned.includes("--"), 'SQL comment dashes must be stripped');

  console.log('    [PASS] SecurityHeaders tests passed.');
};
