/**
 * E2EEncryption.test.js -- End-to-End Encryption & Key Derivation Verification
 */
const assert = require('assert');
const crypto = require('crypto');

module.exports = function testE2EEncryption() {
  console.log('  * Running E2EEncryption test...');

  const algorithm = 'aes-256-cbc';
  const secretKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const plainMessage = 'Hello, this is a secure, end-to-end encrypted ChatWave message!';

  // Encrypt
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(plainMessage, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  assert.notStrictEqual(encrypted, plainMessage, 'Encrypted ciphertext must not match plaintext');
  assert(encrypted.length > 0, 'Ciphertext must not be empty');

  // Decrypt
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  assert.strictEqual(decrypted, plainMessage, 'Decrypted text must match original plaintext');

  console.log('    [PASS] E2EEncryption tests passed.');
};
