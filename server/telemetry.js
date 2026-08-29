/**
 * Prometheus WebRTC Signaling & Room Telemetry Collector.
 * Records active WebSocket connections, peer handshakes, and messages routed.
 */

class ChatWaveTelemetryRegistry {
  constructor() {
    this.activeConnections = 0;
    this.messagesRelayedTotal = 0;
    this.signalingEvents = {
      offer: 0,
      answer: 0,
      ice_candidate: 0,
    };
  }

  recordConnection() {
    this.activeConnections += 1;
  }

  recordDisconnection() {
    this.activeConnections = Math.max(0, this.activeConnections - 1);
  }

  recordMessageRelayed() {
    this.messagesRelayedTotal += 1;
  }

  recordSignalingEvent(type) {
    if (this.signalingEvents[type] !== undefined) {
      this.signalingEvents[type] += 1;
    }
  }

  exportPrometheus() {
    const lines = [
      "# HELP chatwave_active_connections Current active WebSocket peer connections",
      "# TYPE chatwave_active_connections gauge",
      `chatwave_active_connections ${this.activeConnections}`,
      "# HELP chatwave_messages_relayed_total Total messages routed across rooms",
      "# TYPE chatwave_messages_relayed_total counter",
      `chatwave_messages_relayed_total ${this.messagesRelayedTotal}`,
      "# HELP chatwave_webrtc_signaling_events_total WebRTC signaling events by type",
      "# TYPE chatwave_webrtc_signaling_events_total counter",
    ];

    for (const [type, count] of Object.entries(this.signalingEvents)) {
      lines.push(`chatwave_webrtc_signaling_events_total{type="${type}"} ${count}`);
    }

    return lines.join("\n") + "\n";
  }
}

module.exports = { ChatWaveTelemetryRegistry };
