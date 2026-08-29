const assert = require("node:assert/strict");
const { ChatWaveTelemetryRegistry } = require("../../server/telemetry.js");

function runTelemetryTest() {
  console.log("  * Running Telemetry test...");

  const registry = new ChatWaveTelemetryRegistry();
  registry.recordConnection();
  registry.recordConnection();
  registry.recordMessageRelayed();
  registry.recordMessageRelayed();
  registry.recordSignalingEvent("offer");
  registry.recordSignalingEvent("answer");
  registry.recordSignalingEvent("ice_candidate");
  registry.recordDisconnection();

  assert.strictEqual(registry.activeConnections, 1);
  assert.strictEqual(registry.messagesRelayedTotal, 2);
  assert.strictEqual(registry.signalingEvents.offer, 1);

  const prom = registry.exportPrometheus();
  assert.ok(prom.includes("chatwave_active_connections 1"));
  assert.ok(prom.includes("chatwave_messages_relayed_total 2"));
  assert.ok(prom.includes('chatwave_webrtc_signaling_events_total{type="offer"} 1'));

  console.log("    [PASS] Telemetry tests passed.");
}

module.exports = runTelemetryTest;
