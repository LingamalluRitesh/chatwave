import assert from "node:assert/strict";
import { DoubleRatchetSessionGuard } from "../../src/services/double-ratchet-guard.js";

export function runTests() {
  console.log("Running Double Ratchet tests...");
  const guard = new DoubleRatchetSessionGuard("shared_master_seed");

  const k1 = guard.advanceSendChain();
  const k2 = guard.advanceSendChain();
  assert.strictEqual(k1.sequenceNumber, 1);
  assert.strictEqual(k2.sequenceNumber, 2);
  assert.notStrictEqual(k1.messageKey, k2.messageKey);
  assert.strictEqual(k1.messageKey.length, 64);

  // Root rotation
  guard.dhRatchetRotateRoot("new_ephemeral_dh_public_exchange");
  const k3 = guard.advanceSendChain();
  assert.strictEqual(k3.sequenceNumber, 1);
  assert.notStrictEqual(k3.messageKey, k1.messageKey);

  console.log("Double Ratchet tests passed successfully!");
}

runTests();
