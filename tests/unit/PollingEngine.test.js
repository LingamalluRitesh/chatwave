import assert from "node:assert/strict";
import { RoomPollingEngine } from "../../src/services/polling-engine.js";

export function runTests() {
  console.log("Running RoomPollingEngine tests...");
  const engine = new RoomPollingEngine();

  const poll = engine.createPoll("poll_101", "room_dev", "Preferred Backend Framework?", [
    "Node.js",
    "Go",
    "Python",
  ]);
  assert.strictEqual(poll.options.length, 3);

  // Cast votes
  engine.castVote("poll_101", "voter_sha_1", "opt_0"); // Node.js
  engine.castVote("poll_101", "voter_sha_2", "opt_0"); // Node.js
  const results = engine.castVote("poll_101", "voter_sha_3", "opt_1"); // Go

  assert.strictEqual(results.totalVotes, 3);
  assert.strictEqual(results.options[0].votes, 2);
  assert.strictEqual(results.options[0].percentage, 66.7);
  assert.strictEqual(results.options[1].votes, 1);
  assert.strictEqual(results.options[1].percentage, 33.3);

  // Duplicate vote rejection
  assert.throws(() => {
    engine.castVote("poll_101", "voter_sha_1", "opt_2");
  }, /already voted/);

  console.log("RoomPollingEngine tests passed successfully!");
}

runTests();
