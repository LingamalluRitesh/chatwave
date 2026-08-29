import assert from "node:assert/strict";
import { EphemeralMessageManager } from "../../src/services/ephemeral-messages.js";

export function runTests() {
  console.log("Running EphemeralMessageManager tests...");
  const manager = new EphemeralMessageManager();

  const msg = manager.createMessage("msg_1", "room_general", "Top secret coordinates", 5);
  assert.strictEqual(msg.id, "msg_1");
  assert.strictEqual(manager.isExpired("msg_1"), false);

  manager.markAsRead("msg_1");
  assert.ok(msg.readAt > 0);

  // Advance time past 5s TTL
  const future = Date.now() + 6000;
  assert.strictEqual(manager.isExpired("msg_1", future), true);

  const purged = manager.purgeExpiredMessages(future);
  assert.strictEqual(purged, 1);
  assert.strictEqual(manager.messages.has("msg_1"), false);

  console.log("EphemeralMessageManager tests passed successfully!");
}

runTests();
