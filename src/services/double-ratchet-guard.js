/**
 * Double Ratchet Forward Secrecy & Key Derivation Guard.
 * Simulates Diffie-Hellman symmetric chain advancement and HMAC key generation for end-to-end messaging.
 */

const crypto = require("crypto");

class DoubleRatchetSessionGuard {
  constructor(initialSharedSecret = "chatwave_initial_root_secret") {
    this.rootKey = crypto.createHash("sha256").update(initialSharedSecret).digest();
    this.sendChainKey = crypto.createHmac("sha256", this.rootKey).update("SEND_CHAIN_INIT").digest();
    this.recvChainKey = crypto.createHmac("sha256", this.rootKey).update("RECV_CHAIN_INIT").digest();
    this.sendMessageSequence = 0;
    this.recvMessageSequence = 0;
  }

  advanceSendChain() {
    this.sendMessageSequence += 1;
    const messageKey = crypto
      .createHmac("sha256", this.sendChainKey)
      .update(`MESSAGE_KEY_${this.sendMessageSequence}`)
      .digest("hex");

    this.sendChainKey = crypto
      .createHmac("sha256", this.sendChainKey)
      .update("NEXT_CHAIN_KEY")
      .digest();

    return {
      sequenceNumber: this.sendMessageSequence,
      messageKey,
    };
  }

  advanceRecvChain() {
    this.recvMessageSequence += 1;
    const messageKey = crypto
      .createHmac("sha256", this.recvChainKey)
      .update(`MESSAGE_KEY_${this.recvMessageSequence}`)
      .digest("hex");

    this.recvChainKey = crypto
      .createHmac("sha256", this.recvChainKey)
      .update("NEXT_CHAIN_KEY")
      .digest();

    return {
      sequenceNumber: this.recvMessageSequence,
      messageKey,
    };
  }

  dhRatchetRotateRoot(newDhSecret) {
    this.rootKey = crypto
      .createHmac("sha256", this.rootKey)
      .update(newDhSecret)
      .digest();

    this.sendChainKey = crypto.createHmac("sha256", this.rootKey).update("SEND_CHAIN_ROTATED").digest();
    this.recvChainKey = crypto.createHmac("sha256", this.rootKey).update("RECV_CHAIN_ROTATED").digest();
    this.sendMessageSequence = 0;
    this.recvMessageSequence = 0;
  }
}

module.exports = { DoubleRatchetSessionGuard };
