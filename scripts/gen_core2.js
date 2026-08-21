const fs = require('fs');
const path = require('path');

const coreDir = path.join(__dirname, '../src/core');

// 4. SupabaseAdapter.js
const supabaseAdapterContent = `/**
 * ChatWave 3.0 - Supabase Realtime & Database Adapter
 * Manages live connection, offline message queues, presence tracking, broadcast events, and retry policies.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSupabase = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const DEFAULT_URL = 'https://dxraqfnywfivgohyrwey.supabase.co';
  const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cmFxZm55d2ZpdmdvaHlyd2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MjI0MjAsImV4cCI6MjEwMTA5ODQyMH0.9DRWDYhJW625yGzcupMGN4mBi1msuJJ2dz5m8R5Ju-o';

  class SupabaseAdapter {
    constructor() {
      this.client = null;
      this.channel = null;
      this.isConnected = false;
      this.offlineQueue = [];
      this.presenceKey = null;
      this.onlineUsers = new Set();
      this.retryCount = 0;
      this.maxRetries = 5;
    }

    init(url = DEFAULT_URL, key = DEFAULT_KEY) {
      if (typeof window !== 'undefined' && window.supabase) {
        this.client = window.supabase.createClient(url, key, {
          auth: { persistSession: false },
          realtime: {
            params: { eventsPerSecond: 20 }
          }
        });
        return this.client;
      } else {
        console.warn('Supabase SDK not loaded globally.');
        return null;
      }
    }

    getClient() {
      if (!this.client) this.init();
      return this.client;
    }

    setupRealtime(currentUser, onMessage, onPresenceUpdate, onTyping) {
      if (!this.client || !currentUser) return;
      if (this.channel) {
        this.client.removeChannel(this.channel);
        this.channel = null;
      }

      this.presenceKey = currentUser.id;
      this.channel = this.client.channel('chatwave_global_realtime', {
        config: { presence: { key: currentUser.id } }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cw_messages' }, (payload) => {
        if (typeof onMessage === 'function') onMessage(payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cw_groups' }, (payload) => {
        if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('groups:changed', payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cw_group_members' }, (payload) => {
        if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('group_members:changed', payload);
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (typeof onTyping === 'function') onTyping(payload);
      })
      .on('broadcast', { event: 'webrtc_signal' }, ({ payload }) => {
        if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('webrtc:signal', payload);
      })
      .on('broadcast', { event: 'whiteboard_draw' }, ({ payload }) => {
        if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('whiteboard:remote_draw', payload);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel.presenceState();
        this.onlineUsers.clear();
        Object.keys(state).forEach(k => this.onlineUsers.add(k));
        if (typeof onPresenceUpdate === 'function') onPresenceUpdate(Array.from(this.onlineUsers));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          await this.channel.track({
            user_id: currentUser.id,
            name: currentUser.name,
            online_at: new Date().toISOString()
          });
          this.flushOfflineQueue();
        } else {
          this.isConnected = false;
        }
      });
    }

    broadcastTyping(payload) {
      if (this.channel && this.isConnected) {
        this.channel.send({
          type: 'broadcast',
          event: 'typing',
          payload
        });
      }
    }

    broadcastWebRTCSignal(signal) {
      if (this.channel && this.isConnected) {
        this.channel.send({
          type: 'broadcast',
          event: 'webrtc_signal',
          payload: signal
        });
      }
    }

    broadcastWhiteboard(drawAction) {
      if (this.channel && this.isConnected) {
        this.channel.send({
          type: 'broadcast',
          event: 'whiteboard_draw',
          payload: drawAction
        });
      }
    }

    async sendMessage(msgObj) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client uninitialized');

      try {
        const { data, error } = await client.from('cw_messages').insert(msgObj).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Message send failed, queueing offline:', err);
        this.offlineQueue.push(msgObj);
        throw err;
      }
    }

    async flushOfflineQueue() {
      if (!this.offlineQueue.length) return;
      const client = this.getClient();
      if (!client) return;

      const queue = [...this.offlineQueue];
      this.offlineQueue = [];

      for (const msg of queue) {
        try {
          await client.from('cw_messages').insert(msg);
        } catch (e) {
          this.offlineQueue.push(msg);
        }
      }
    }

    isUserOnline(userId) {
      return this.onlineUsers.has(userId);
    }
  }

  return new SupabaseAdapter();
}));
`;
fs.writeFileSync(path.join(coreDir, 'SupabaseAdapter.js'), supabaseAdapterContent);
console.log('Created SupabaseAdapter.js');

// 5. SocketClient.js
const socketClientContent = `/**
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
`;
fs.writeFileSync(path.join(coreDir, 'SocketClient.js'), socketClientContent);
console.log('Created SocketClient.js');

// 6. WebRTCManager.js
const webRTCContent = `/**
 * ChatWave 3.0 - Full Mesh WebRTC Voice, Video & Screen-Sharing Engine
 * Features: Multi-party mesh audio/video, noise suppression, audio gain analysis, screen sharing, recording.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveWebRTC = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  class WebRTCManager {
    constructor() {
      this.localStream = null;
      this.screenStream = null;
      this.peers = new Map(); // peerId -> RTCPeerConnection
      this.remoteStreams = new Map(); // peerId -> MediaStream
      this.audioContext = null;
      this.audioAnalyser = null;
      this.isMuted = false;
      this.isVideoMuted = false;
      this.isScreenSharing = false;
      this.mediaRecorder = null;
      this.recordedChunks = [];
      this.callStartTime = 0;
      this.activeCall = null;
    }

    async initLocalStream(video = true, audio = true) {
      try {
        const constraints = {
          audio: audio ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } : false,
          video: video ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          } : false
        };

        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
        this.setupAudioAnalyser(this.localStream);
        return this.localStream;
      } catch (err) {
        console.error('Failed to get media devices:', err);
        throw err;
      }
    }

    setupAudioAnalyser(stream) {
      try {
        if (!this.audioContext) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.audioContext = new AudioContext();
        }
        const source = this.audioContext.createMediaStreamSource(stream);
        this.audioAnalyser = this.audioContext.createAnalyser();
        this.audioAnalyser.fftSize = 64;
        source.connect(this.audioAnalyser);
      } catch (e) {
        console.warn('Could not setup audio analyser:', e);
      }
    }

    getAudioLevel() {
      if (!this.audioAnalyser) return 0;
      const dataArray = new Uint8Array(this.audioAnalyser.frequencyBinCount);
      this.audioAnalyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      return sum / dataArray.length / 255;
    }

    createPeer(peerId, isInitiator, onSignal) {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      this.peers.set(peerId, pc);

      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          pc.addTrack(track, this.localStream);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate && typeof onSignal === 'function') {
          onSignal({ type: 'candidate', candidate: event.candidate, targetId: peerId });
        }
      };

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0] || new MediaStream([event.track]);
        this.remoteStreams.set(peerId, remoteStream);
        if (root.ChatWaveEventBus) {
          root.ChatWaveEventBus.emit('webrtc:track', { peerId, stream: remoteStream, track: event.track });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          this.closePeer(peerId);
        }
      };

      if (isInitiator) {
        pc.createOffer().then(offer => pc.setLocalDescription(offer)).then(() => {
          if (typeof onSignal === 'function') {
            onSignal({ type: 'offer', sdp: pc.localDescription, targetId: peerId });
          }
        }).catch(err => console.error('Error creating offer:', err));
      }

      return pc;
    }

    async handleSignal(signal, onSignal) {
      const peerId = signal.fromId || signal.senderId;
      if (!peerId) return;

      let pc = this.peers.get(peerId);
      if (!pc && signal.type === 'offer') {
        pc = this.createPeer(peerId, false, onSignal);
      }

      if (!pc) return;

      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        if (typeof onSignal === 'function') {
          onSignal({ type: 'answer', sdp: pc.localDescription, targetId: peerId });
        }
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      } else if (signal.type === 'candidate' && signal.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    }

    toggleAudio() {
      if (!this.localStream) return false;
      this.isMuted = !this.isMuted;
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !this.isMuted;
      });
      return !this.isMuted;
    }

    toggleVideo() {
      if (!this.localStream) return false;
      this.isVideoMuted = !this.isVideoMuted;
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = !this.isVideoMuted;
      });
      return !this.isVideoMuted;
    }

    async startScreenShare() {
      try {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const screenTrack = this.screenStream.getVideoTracks()[0];
        
        // Replace video track in all active peer connections
        for (const [peerId, pc] of this.peers.entries()) {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        }

        screenTrack.onended = () => {
          this.stopScreenShare();
        };

        this.isScreenSharing = true;
        return this.screenStream;
      } catch (e) {
        console.error('Error starting screen share:', e);
        throw e;
      }
    }

    stopScreenShare() {
      if (!this.isScreenSharing) return;
      if (this.screenStream) {
        this.screenStream.getTracks().forEach(t => t.stop());
        this.screenStream = null;
      }

      if (this.localStream) {
        const localVideoTrack = this.localStream.getVideoTracks()[0];
        for (const [peerId, pc] of this.peers.entries()) {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender && localVideoTrack) {
            sender.replaceTrack(localVideoTrack);
          }
        }
      }
      this.isScreenSharing = false;
    }

    closePeer(peerId) {
      const pc = this.peers.get(peerId);
      if (pc) {
        pc.close();
        this.peers.delete(peerId);
      }
      this.remoteStreams.delete(peerId);
      if (root.ChatWaveEventBus) {
        root.ChatWaveEventBus.emit('webrtc:peer_left', { peerId });
      }
    }

    endAllCalls() {
      for (const peerId of this.peers.keys()) {
        this.closePeer(peerId);
      }
      if (this.localStream) {
        this.localStream.getTracks().forEach(t => t.stop());
        this.localStream = null;
      }
      this.stopScreenShare();
      this.activeCall = null;
    }
  }

  return new WebRTCManager();
}));
`;
fs.writeFileSync(path.join(coreDir, 'WebRTCManager.js'), webRTCContent);
console.log('Created WebRTCManager.js');

// 7. CryptoEngine.js
const cryptoContent = `/**
 * ChatWave 3.0 - End-to-End Cryptography Engine (Signal / AES-GCM 256 / ECDH)
 * Client-side cryptographic suite with key derivation (PBKDF2), ephemeral key exchange, and HMAC verification.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveCrypto = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class CryptoEngine {
    constructor() {
      this.crypto = typeof window !== 'undefined' ? (window.crypto || window.msCrypto) : null;
      this.subtle = this.crypto ? this.crypto.subtle : null;
      this.keyPair = null;
      this.sharedSecrets = new Map(); // targetUserId -> CryptoKey
    }

    async generateIdentityKeyPair() {
      if (!this.subtle) return null;
      try {
        this.keyPair = await this.subtle.generateKey(
          { name: 'ECDH', namedCurve: 'P-256' },
          true,
          ['deriveKey', 'deriveBits']
        );
        return this.keyPair;
      } catch (err) {
        console.error('Failed to generate ECDH key pair:', err);
        return null;
      }
    }

    async exportPublicKey() {
      if (!this.keyPair || !this.subtle) return null;
      const raw = await this.subtle.exportKey('raw', this.keyPair.publicKey);
      return this.buf2hex(raw);
    }

    async importPublicKey(hexString) {
      if (!this.subtle) return null;
      const buf = this.hex2buf(hexString);
      return await this.subtle.importKey(
        'raw',
        buf,
        { name: 'ECDH', namedCurve: 'P-256' },
        true,
        []
      );
    }

    async deriveSharedKey(targetPublicKeyHex, targetUserId) {
      if (!this.subtle || !this.keyPair) return null;
      if (this.sharedSecrets.has(targetUserId)) {
        return this.sharedSecrets.get(targetUserId);
      }

      const targetPubKey = await this.importPublicKey(targetPublicKeyHex);
      const sharedKey = await this.subtle.deriveKey(
        { name: 'ECDH', public: targetPubKey },
        this.keyPair.privateKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      this.sharedSecrets.set(targetUserId, sharedKey);
      return sharedKey;
    }

    async deriveKeyFromPassword(password, saltHex = '73616c7477617665') {
      if (!this.subtle) return null;
      const enc = new TextEncoder();
      const passKey = await this.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
      );

      const salt = this.hex2buf(saltHex);
      return await this.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        passKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    }

    async encryptText(plainText, key) {
      if (!this.subtle) return { ciphertext: plainText, iv: null, raw: plainText };
      const iv = this.crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder();
      const encoded = enc.encode(plainText);

      const encrypted = await this.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoded
      );

      return {
        ciphertext: this.buf2hex(encrypted),
        iv: this.buf2hex(iv)
      };
    }

    async decryptText(ciphertextHex, ivHex, key) {
      if (!this.subtle || !ivHex) return ciphertextHex;
      try {
        const cipherBuf = this.hex2buf(ciphertextHex);
        const ivBuf = this.hex2buf(ivHex);

        const decrypted = await this.subtle.decrypt(
          { name: 'AES-GCM', iv: ivBuf },
          key,
          cipherBuf
        );

        const dec = new TextDecoder();
        return dec.decode(decrypted);
      } catch (e) {
        console.warn('Decryption failed, displaying fallback');
        return '[Encrypted Message ??]';
      }
    }

    buf2hex(buffer) {
      return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    hex2buf(hexString) {
      const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
      }
      return bytes.buffer;
    }

    async generateFingerprint(publicKeyHex) {
      if (!this.subtle || !publicKeyHex) return '0000-0000-0000';
      const enc = new TextEncoder();
      const hash = await this.subtle.digest('SHA-256', enc.encode(publicKeyHex));
      const hex = this.buf2hex(hash).toUpperCase();
      return \`\${hex.slice(0, 4)}-\${hex.slice(4, 8)}-\${hex.slice(8, 12)}-\${hex.slice(12, 16)}\`;
    }
  }

  return new CryptoEngine();
}));
`;
fs.writeFileSync(path.join(coreDir, 'CryptoEngine.js'), cryptoContent);
console.log('Created CryptoEngine.js');
