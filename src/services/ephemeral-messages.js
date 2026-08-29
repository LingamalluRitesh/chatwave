/**
 * Ephemeral Disappearing Messages & Burn-After-Reading Engine.
 * Manages message TTL lifecycles, read receipt trigger countdowns, and automatic memory cleanup.
 */

class EphemeralMessageManager {
  constructor() {
    this.messages = new Map();
  }

  createMessage(id, roomId, content, ttlSec = 60) {
    const msg = {
      id,
      roomId,
      content,
      createdAt: Date.now(),
      ttlSec,
      readAt: null,
      isBurned: false,
    };
    this.messages.set(id, msg);
    return msg;
  }

  markAsRead(id) {
    const msg = this.messages.get(id);
    if (!msg || msg.isBurned) return null;

    if (!msg.readAt) {
      msg.readAt = Date.now();
    }
    return msg;
  }

  isExpired(id, now = Date.now()) {
    const msg = this.messages.get(id);
    if (!msg) return true;
    if (msg.isBurned) return true;

    if (msg.readAt && now >= msg.readAt + msg.ttlSec * 1000) {
      return true;
    }
    if (now >= msg.createdAt + msg.ttlSec * 2 * 1000) {
      return true;
    }
    return false;
  }

  purgeExpiredMessages(now = Date.now()) {
    let purgedCount = 0;
    for (const [id, msg] of this.messages.entries()) {
      if (this.isExpired(id, now)) {
        msg.isBurned = true;
        msg.content = "[BURNED_MESSAGE]";
        this.messages.delete(id);
        purgedCount++;
      }
    }
    return purgedCount;
  }
}

module.exports = { EphemeralMessageManager };
