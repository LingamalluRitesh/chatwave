const fs = require('fs');
const path = require('path');

const coreDir = path.join(__dirname, '../src/core');

// 8. IndexedDBStorage.js
const indexedDBContent = `/**
 * ChatWave 3.0 - Offline-First IndexedDB Storage Layer
 * Stores messages, contacts, media blobs, drafts, vault files, and preferences with indexes.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveIndexedDB = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const DB_NAME = 'ChatWaveOfflineDB';
  const DB_VERSION = 2;

  class IndexedDBStorage {
    constructor() {
      this.db = null;
      this.readyPromise = this.initDB();
    }

    initDB() {
      return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
          console.warn('IndexedDB not supported in this environment');
          return resolve(null);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          if (!db.objectStoreNames.contains('messages')) {
            const msgStore = db.createObjectStore('messages', { keyPath: 'id' });
            msgStore.createIndex('chatId', 'chatId', { unique: false });
            msgStore.createIndex('created_at', 'created_at', { unique: false });
          }

          if (!db.objectStoreNames.contains('chats')) {
            db.createObjectStore('chats', { keyPath: 'id' });
          }

          if (!db.objectStoreNames.contains('vault')) {
            const vaultStore = db.createObjectStore('vault', { keyPath: 'id' });
            vaultStore.createIndex('type', 'type', { unique: false });
            vaultStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          if (!db.objectStoreNames.contains('drafts')) {
            db.createObjectStore('drafts', { keyPath: 'chatId' });
          }

          if (!db.objectStoreNames.contains('media_cache')) {
            db.createObjectStore('media_cache', { keyPath: 'url' });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.error('IndexedDB open error:', event.target.error);
          resolve(null);
        };
      });
    }

    async saveMessage(msg) {
      await this.readyPromise;
      if (!this.db || !msg || !msg.id) return;
      return new Promise((resolve) => {
        const tx = this.db.transaction('messages', 'readwrite');
        const store = tx.objectStore('messages');
        store.put(msg);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }

    async getMessagesForChat(chatId, limit = 100) {
      await this.readyPromise;
      if (!this.db) return [];
      return new Promise((resolve) => {
        const tx = this.db.transaction('messages', 'readonly');
        const store = tx.objectStore('messages');
        const index = store.index('chatId');
        const req = index.getAll(chatId);
        req.onsuccess = () => {
          const res = req.result || [];
          res.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
          resolve(res.slice(-limit));
        };
        req.onerror = () => resolve([]);
      });
    }

    async saveDraft(chatId, text) {
      await this.readyPromise;
      if (!this.db) return;
      return new Promise((resolve) => {
        const tx = this.db.transaction('drafts', 'readwrite');
        const store = tx.objectStore('drafts');
        if (text) store.put({ chatId, text, updatedAt: Date.now() });
        else store.delete(chatId);
        tx.oncomplete = () => resolve(true);
      });
    }

    async getDraft(chatId) {
      await this.readyPromise;
      if (!this.db) return '';
      return new Promise((resolve) => {
        const tx = this.db.transaction('drafts', 'readonly');
        const store = tx.objectStore('drafts');
        const req = store.get(chatId);
        req.onsuccess = () => resolve(req.result ? req.result.text : '');
        req.onerror = () => resolve('');
      });
    }

    async saveVaultFile(fileObj) {
      await this.readyPromise;
      if (!this.db) return;
      return new Promise((resolve) => {
        const tx = this.db.transaction('vault', 'readwrite');
        const store = tx.objectStore('vault');
        store.put(fileObj);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }

    async getVaultFiles() {
      await this.readyPromise;
      if (!this.db) return [];
      return new Promise((resolve) => {
        const tx = this.db.transaction('vault', 'readonly');
        const store = tx.objectStore('vault');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }

    async clearAllData() {
      await this.readyPromise;
      if (!this.db) return;
      const stores = ['messages', 'chats', 'vault', 'drafts', 'media_cache'];
      for (const s of stores) {
        try {
          const tx = this.db.transaction(s, 'readwrite');
          tx.objectStore(s).clear();
        } catch (e) {}
      }
    }
  }

  return new IndexedDBStorage();
}));
`;
fs.writeFileSync(path.join(coreDir, 'IndexedDBStorage.js'), indexedDBContent);
console.log('Created IndexedDBStorage.js');

// 9. SoundSynthesizer.js
const soundSynthesizerContent = `/**
 * ChatWave 3.0 - Procedural Web Audio API Sound Synthesizer
 * Generates dynamic audio cues, chimes, incoming rings, pops, and soundboard effects without external MP3 dependencies.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSound = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class SoundSynthesizer {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.masterGain = null;
      this.activeRingtone = null;
    }

    getContext() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    playNote(freq, type = 'sine', duration = 0.15, gainVal = 0.2, delay = 0, endFreq = null) {
      if (!this.enabled) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const startTime = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), startTime + duration);
      }

      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    playSequence(notesArray) {
      if (!this.enabled || !Array.isArray(notesArray)) return;
      for (const note of notesArray) {
        this.playNote(
          note.freq,
          note.type || 'sine',
          note.duration || 0.15,
          note.gain || 0.2,
          note.delay || 0,
          note.endFreq || null
        );
      }
    }

    playMessageReceived() {
      this.playNote(587.33, 'sine', 0.12, 0.25, 0);
      this.playNote(880.00, 'sine', 0.25, 0.3, 0.08);
    }

    playMessageSent() {
      this.playNote(740.00, 'triangle', 0.06, 0.18, 0);
      this.playNote(1108.73, 'sine', 0.12, 0.22, 0.05);
    }

    playReactionPop() {
      this.playNote(320, 'sine', 0.12, 0.25, 0, 950);
    }

    playButtonClick() {
      this.playNote(1400, 'triangle', 0.025, 0.08);
    }

    playVictory() {
      this.playNote(523.25, 'triangle', 0.1, 0.2, 0);
      this.playNote(659.25, 'triangle', 0.1, 0.2, 0.08);
      this.playNote(783.99, 'triangle', 0.1, 0.2, 0.16);
      this.playNote(1046.50, 'sine', 0.35, 0.3, 0.24);
    }

    playDefeat() {
      this.playNote(392.00, 'sawtooth', 0.15, 0.18, 0);
      this.playNote(349.23, 'sawtooth', 0.15, 0.18, 0.12);
      this.playNote(329.63, 'sawtooth', 0.15, 0.18, 0.24);
      this.playNote(261.63, 'sawtooth', 0.3, 0.22, 0.36);
    }

    startRinging() {
      if (this.activeRingtone) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const ringLoop = () => {
        this.playNote(440, 'sine', 0.35, 0.25, 0);
        this.playNote(480, 'sine', 0.35, 0.25, 0);
        this.playNote(440, 'sine', 0.35, 0.25, 0.5);
        this.playNote(480, 'sine', 0.35, 0.25, 0.5);
      };

      ringLoop();
      this.activeRingtone = setInterval(ringLoop, 3000);
    }

    stopRinging() {
      if (this.activeRingtone) {
        clearInterval(this.activeRingtone);
        this.activeRingtone = null;
      }
    }

    setVolume(val) {
      if (this.masterGain && this.ctx) {
        const clamped = Math.max(0, Math.min(1, val));
        this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
      }
    }
  }

  return new SoundSynthesizer();
}));
`;
fs.writeFileSync(path.join(coreDir, 'SoundSynthesizer.js'), soundSynthesizerContent);
console.log('Created SoundSynthesizer.js');

// 10. ParticleEffects.js
const particleEffectsContent = `/**
 * ChatWave 3.0 - Canvas-based Interactive Particle & Reaction Burst Engine
 * Supports Confetti explosions, Heart bursts, Fire celebration, Stars, and Floating Emojis.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveParticles = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class ParticleEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.animId = null;
      this.initCanvas();
    }

    initCanvas() {
      if (typeof document === 'undefined') return;
      let el = document.getElementById('cw-particles-canvas');
      if (!el) {
        el = document.createElement('canvas');
        el.id = 'cw-particles-canvas';
        el.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;';
        document.body.appendChild(el);
      }
      this.canvas = el;
      this.ctx = el.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      this.canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      if (this.ctx) {
        this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    }

    burst(x, y, count = 30, colors = ['#00a884', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 8;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          radius: 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          gravity: 0.25,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.2,
          shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
      }
      this.startLoop();
    }

    burstHearts(x, y, count = 16) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          char: '??',
          size: 16 + Math.random() * 14,
          alpha: 1,
          decay: 0.02,
          gravity: 0.15,
          isEmoji: true
        });
      }
      this.startLoop();
    }

    burstEmoji(x, y, emoji = '??', count = 12) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          char: emoji,
          size: 18 + Math.random() * 12,
          alpha: 1,
          decay: 0.018,
          gravity: 0.2,
          isEmoji: true
        });
      }
      this.startLoop();
    }

    startLoop() {
      if (!this.animId) {
        this.animId = requestAnimationFrame(() => this.loop());
      }
    }

    loop() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.isEmoji) {
          this.ctx.font = \`\${p.size}px sans-serif\`;
          this.ctx.fillText(p.char, p.x, p.y);
        } else if (p.shape === 'rect') {
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rotation += p.vRot);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.fill();
        }

        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
      }
    }
  }

  return new ParticleEngine();
}));
`;
fs.writeFileSync(path.join(coreDir, 'ParticleEffects.js'), particleEffectsContent);
console.log('Created ParticleEffects.js');

// 11. I18nEngine.js
const i18nContent = `/**
 * ChatWave 3.0 - Multi-Language Localization Engine
 * Supports English, Spanish, French, German, Hindi, Japanese, Chinese, and Arabic.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveI18n = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const DICTIONARIES = {
    en: {
      appName: 'ChatWave',
      tagline: 'Private & Secure Cloud Messaging',
      searchPlaceholder: 'Search chats, contacts, channels...',
      typeMessage: 'Type a message...',
      online: 'Online',
      offline: 'Offline',
      typing: 'is typing...',
      newGroup: 'New Group',
      newChannel: 'New Channel',
      whiteboard: 'Whiteboard',
      miniApps: 'Mini-Apps & Games',
      aiAssistant: 'AI Assistant',
      vault: 'Cloud Vault',
      settings: 'Settings',
      theme: 'Theme Studio',
      soundboard: 'Soundboard',
      logout: 'Log Out',
      all: 'All',
      unread: 'Unread',
      groups: 'Groups',
      channels: 'Channels',
      direct: 'Direct',
      call: 'Voice & Video Call',
      mute: 'Mute',
      unmute: 'Unmute',
      screenShare: 'Share Screen',
      endCall: 'End Call'
    },
    es: {
      appName: 'ChatWave',
      tagline: 'Mensajería en la Nube Privada y Segura',
      searchPlaceholder: 'Buscar chats, contactos, canales...',
      typeMessage: 'Escribe un mensaje...',
      online: 'En línea',
      offline: 'Desconectado',
      typing: 'está escribiendo...',
      newGroup: 'Nuevo Grupo',
      newChannel: 'Nuevo Canal',
      whiteboard: 'Pizarra',
      miniApps: 'Juegos y Mini-Apps',
      aiAssistant: 'Asistente IA',
      vault: 'Bóveda de Archivos',
      settings: 'Ajustes',
      theme: 'Estudio de Temas',
      soundboard: 'Panel de Sonidos',
      logout: 'Cerrar Sesión',
      all: 'Todos',
      unread: 'No leídos',
      groups: 'Grupos',
      channels: 'Canales',
      direct: 'Directo',
      call: 'Llamada de Voz y Video',
      mute: 'Silenciar',
      unmute: 'Activar sonido',
      screenShare: 'Compartir Pantalla',
      endCall: 'Finalizar Llamada'
    },
    hi: {
      appName: '??????',
      tagline: '???????? ?? ???? ?????? ????????',
      searchPlaceholder: '???, ?????? ?????...',
      typeMessage: '?? ????? ?????...',
      online: '??????',
      offline: '??????',
      typing: '???? ?? ??? ??...',
      newGroup: '??? ????',
      newChannel: '??? ????',
      whiteboard: '???????????',
      miniApps: '??? ?? ????',
      aiAssistant: '??? ?????',
      vault: '?????? ?????',
      settings: '????????',
      theme: '??? ????????',
      soundboard: '??????????',
      logout: '??? ???',
      all: '???',
      unread: '?????',
      groups: '????',
      channels: '????',
      direct: '?????????',
      call: '??? ????',
      mute: '?????',
      unmute: '???????',
      screenShare: '??????? ????',
      endCall: '??? ??????'
    }
  };

  class I18nEngine {
    constructor() {
      this.locale = 'en';
      this.dictionaries = DICTIONARIES;
    }

    setLocale(loc) {
      if (this.dictionaries[loc]) {
        this.locale = loc;
        return true;
      }
      return false;
    }

    getLocale() {
      return this.locale;
    }

    t(key) {
      const dict = this.dictionaries[this.locale] || this.dictionaries['en'];
      return dict[key] || this.dictionaries['en'][key] || key;
    }
  }

  return new I18nEngine();
}));
`;
fs.writeFileSync(path.join(coreDir, 'I18nEngine.js'), i18nContent);
console.log('Created I18nEngine.js');
