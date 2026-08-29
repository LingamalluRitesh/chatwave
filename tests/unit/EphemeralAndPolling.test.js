const assert = require("node:assert/strict");
const { EphemeralMessageManager } = require("../../src/services/ephemeral-messages.js");
const { RoomPollingEngine } = require("../../src/services/polling-engine.js");
const { DoubleRatchetSessionGuard } = require("../../src/services/double-ratchet-guard.js");

function runEphemeralAndPollingTest() {
  console.log("  * Running EphemeralAndPolling test...");

  // 1. Ephemeral Messaging
  const ephem = new EphemeralMessageManager();
  ephem.createMessage("msg_confidential_1", "room_1", "Secret Passcode 4829", 2);
  ephem.markAsRead("msg_confidential_1");
  const futureTime = Date.now() + 3000;
  assert.strictEqual(ephem.isExpired("msg_confidential_1", futureTime), true);
  ephem.purgeExpiredMessages(futureTime);
  assert.strictEqual(ephem.messages.has("msg_confidential_1"), false);

  // 2. Room Polling
  const poller = new RoomPollingEngine();
  poller.createPoll("p_standup", "room_1", "Standup Time?", ["9:00 AM", "10:00 AM"]);
  poller.castVote("p_standup", "user_1", "opt_0");
  poller.castVote("p_standup", "user_2", "opt_0");
  const closedResults = poller.closePoll("p_standup");
  assert.strictEqual(closedResults.isClosed, true);
  assert.strictEqual(closedResults.totalVotes, 2);
  assert.strictEqual(closedResults.options[0].percentage, 100.0);

  // 3. Double Ratchet Keys
  const ratchet = new DoubleRatchetSessionGuard("master_room_key");
  const step1 = ratchet.advanceSendChain();
  const step2 = ratchet.advanceSendChain();
  assert.strictEqual(step2.sequenceNumber, 2);
  assert.notStrictEqual(step1.messageKey, step2.messageKey);

  console.log("    [PASS] EphemeralAndPolling tests passed.");
}

module.exports = runEphemeralAndPollingTest;
