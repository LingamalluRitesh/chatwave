/**
 * ChatWave 3.0 - Standalone WebSocket / Socket.IO Client Adapter
 * Fallback signaling channel and direct peer event transport.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSocket = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class SocketClient {
    constructor() {
      this.socket = null;
      this.connected = false;
      this.url = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'http://localhost:3000';
    }

    connect(serverUrl = this.url, token = null) {
      if (typeof window !== 'undefined' && window.io) {
        this.socket = window.io(serverUrl, {
          auth: { token },
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
          this.connected = true;
          if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('socket:connected');
        });

        this.socket.on('disconnect', () => {
          this.connected = false;
          if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('socket:disconnected');
        });

        this.socket.on('message:new', (msg) => {
          if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('socket:message', msg);
        });

        this.socket.on('call:incoming', (callData) => {
          if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('call:incoming', callData);
        });

        this.socket.on('webrtc:signal', (signal) => {
          if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('webrtc:signal', signal);
        });

        return this.socket;
      }
      return null;
    }

    emit(event, data) {
      if (this.socket && this.connected) {
        this.socket.emit(event, data);
      }
    }

    on(event, cb) {
      if (this.socket) {
        this.socket.on(event, cb);
      }
    }
  }

  return new SocketClient();
}));
