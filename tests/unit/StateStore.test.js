/**
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
