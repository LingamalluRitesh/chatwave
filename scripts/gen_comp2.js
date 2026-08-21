const fs = require('fs');
const path = require('path');

const compDir = path.join(__dirname, '../src/components');

// 5. ThemeStudioComponent.js
const themeStudioContent = `/**
 * ChatWave 3.0 - Dynamic Theme Studio & Color Customizer
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveThemeStudio = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const PRESET_THEMES = [
    { id: 'dark', name: 'ChatWave Dark Classic', bg: '#111b21', accent: '#00a884', sec: '#202c33', text: '#e9edef' },
    { id: 'light', name: 'ChatWave Cream Light', bg: '#efeae2', accent: '#00a884', sec: '#ffffff', text: '#111b21' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon 2077', bg: '#090d16', accent: '#06b6d4', sec: '#1e1b4b', text: '#f8fafc' },
    { id: 'oled_black', name: 'Pitch Black OLED', bg: '#000000', accent: '#3b82f6', sec: '#121212', text: '#ffffff' },
    { id: 'emerald', name: 'Emerald Forest', bg: '#06281e', accent: '#10b981', sec: '#0e3d30', text: '#ecfdf5' },
    { id: 'sunset', name: 'Sunset Glow', bg: '#1c1024', accent: '#f97316', sec: '#2e183b', text: '#fff7ed' },
    { id: 'amethyst', name: 'Amethyst Royal', bg: '#190d2e', accent: '#a855f7', sec: '#281447', text: '#faf5ff' },
    { id: 'nordic', name: 'Nordic Frost', bg: '#0f172a', accent: '#38bdf8', sec: '#1e293b', text: '#f0f9ff' }
  ];

  class ThemeStudioComponent {
    constructor() {
      this.currentTheme = this.loadTheme();
      this.applyTheme(this.currentTheme);
    }

    loadTheme() {
      return localStorage.getItem('cw_theme') || 'dark';
    }

    applyTheme(themeId) {
      document.documentElement.setAttribute('data-theme', themeId);
      localStorage.setItem('cw_theme', themeId);
      this.currentTheme = themeId;
      if (root.ChatWaveStateStore) root.ChatWaveStateStore.setTheme(themeId);
    }

    setCustomColor(prop, value) {
      document.documentElement.style.setProperty(prop, value);
    }

    getPresets() {
      return PRESET_THEMES;
    }
  }

  return new ThemeStudioComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'ThemeStudio/ThemeStudioComponent.js'), themeStudioContent);
console.log('Created ThemeStudioComponent.js');

// 6. SoundboardComponent.js
const soundboardContent = `/**
 * ChatWave 3.0 - In-Chat Interactive Soundboard FX Pad
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSoundboard = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const PADS = [
    { id: 'pop', name: 'Pop ??', freq: 440, type: 'sine', duration: 0.1 },
    { id: 'laser', name: 'Laser ??', freq: 1500, endFreq: 100, type: 'sawtooth', duration: 0.15 },
    { id: 'bell', name: 'Bell ??', freq: 880, type: 'triangle', duration: 0.4 },
    { id: 'chime', name: 'Chime ?', freq: 1200, type: 'sine', duration: 0.3 },
    { id: 'horn', name: 'Airhorn ??', freq: 466.16, type: 'sawtooth', duration: 0.35 },
    { id: 'bass', name: 'Bass Drop ??', freq: 120, endFreq: 40, type: 'sine', duration: 0.5 },
    { id: 'win', name: 'Victory ??', freq: 523.25, type: 'triangle', duration: 0.2 },
    { id: 'lose', name: 'Oof ??', freq: 220, endFreq: 80, type: 'sawtooth', duration: 0.3 }
  ];

  class SoundboardComponent {
    constructor() {
      this.pads = PADS;
    }

    playPad(padId) {
      const pad = this.pads.find(p => p.id === padId);
      if (!pad || !root.ChatWaveSound) return;
      root.ChatWaveSound.playNote(pad.freq, pad.type, pad.duration, 0.3, 0, pad.endFreq);
      if (root.ChatWaveParticles) {
        root.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 15);
      }
    }

    triggerPadToChat(padId) {
      this.playPad(padId);
      const pad = this.pads.find(p => p.id === padId);
      if (root.ChatWaveApp && pad) {
        root.ChatWaveApp.sendMessage({
          type: 'soundboard',
          content: \`?? Played Soundboard FX: \${pad.name}\`,
          data: { padId }
        });
      }
    }
  }

  return new SoundboardComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Soundboard/SoundboardComponent.js'), soundboardContent);
console.log('Created SoundboardComponent.js');

// 7. VaultComponent.js
const vaultContent = `/**
 * ChatWave 3.0 - Encrypted Cloud Vault & Storage Manager
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveVault = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class VaultComponent {
    constructor() {
      this.files = [];
      this.totalUsedBytes = 0;
      this.maxBytes = 10 * 1024 * 1024 * 1024; // 10 GB
      this.loadFiles();
    }

    async loadFiles() {
      if (root.ChatWaveIndexedDB) {
        this.files = await root.ChatWaveIndexedDB.getVaultFiles();
        this.calcStorage();
      }
    }

    calcStorage() {
      this.totalUsedBytes = this.files.reduce((acc, f) => acc + (f.size || 0), 0);
    }

    async addFile(fileBlob, name, type = 'document') {
      const fileObj = {
        id: 'vault_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name,
        type,
        size: fileBlob.size || 1024,
        url: URL.createObjectURL(fileBlob),
        timestamp: Date.now()
      };

      this.files.push(fileObj);
      this.calcStorage();

      if (root.ChatWaveIndexedDB) {
        await root.ChatWaveIndexedDB.saveVaultFile(fileObj);
      }

      return fileObj;
    }

    getFilesByType(type) {
      if (!type || type === 'all') return this.files;
      return this.files.filter(f => f.type === type);
    }
  }

  return new VaultComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Vault/VaultComponent.js'), vaultContent);
console.log('Created VaultComponent.js');

// 8. MediaEditorComponent.js
const mediaEditorContent = `/**
 * ChatWave 3.0 - In-Browser Media & Image Editor
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveMediaEditor = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class MediaEditorComponent {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.currentImage = null;
      this.filter = 'normal';
    }

    loadImage(src, canvasId = 'cw-media-editor-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.currentImage = img;
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.render();
      };
      img.src = src;
    }

    applyFilter(filterName) {
      this.filter = filterName;
      this.render();
    }

    render() {
      if (!this.ctx || !this.currentImage) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.filter === 'grayscale') this.ctx.filter = 'grayscale(100%)';
      else if (this.filter === 'sepia') this.ctx.filter = 'sepia(100%)';
      else if (this.filter === 'cyber') this.ctx.filter = 'hue-rotate(180deg) saturate(200%)';
      else if (this.filter === 'vintage') this.ctx.filter = 'contrast(120%) brightness(90%) sepia(40%)';
      else this.ctx.filter = 'none';

      this.ctx.drawImage(this.currentImage, 0, 0);
    }

    exportEdited() {
      if (!this.canvas) return null;
      return this.canvas.toDataURL('image/jpeg', 0.9);
    }
  }

  return new MediaEditorComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'MediaEditor/MediaEditorComponent.js'), mediaEditorContent);
console.log('Created MediaEditorComponent.js');

// 9. ChannelsComponent.js
const channelsContent = `/**
 * ChatWave 3.0 - Broadcast Channels & Communities Manager
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveChannels = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class ChannelsComponent {
    constructor() {
      this.channels = [
        {
          id: 'chan_announcements',
          name: 'ChatWave Official Announcements ??',
          description: 'Official product release notes, live events, and platform updates.',
          subscribersCount: 14200,
          verified: true,
          color: '#00a884',
          posts: [
            { id: 'p1', content: '?? Welcome to ChatWave 3.0! Featuring WebRTC HD Calls, Whiteboard Canvas, Mini-Apps, and End-to-End Encryption.', ts: Date.now() - 86400000, reactions: { '??': 245, '??': 189, '??': 310 } }
          ]
        },
        {
          id: 'chan_tech_innovations',
          name: 'Tech & AI Innovations ??',
          description: 'Exploring the future of computing, generative models, and agentic workflows.',
          subscribersCount: 8900,
          verified: false,
          color: '#3b82f6',
          posts: [
            { id: 'p2', content: '?? Multi-agent pair programming creates extraordinary software at lightspeed.', ts: Date.now() - 43200000, reactions: { '??': 92, '??': 64 } }
          ]
        }
      ];
    }

    getAll() {
      return this.channels;
    }

    getById(id) {
      return this.channels.find(c => c.id === id);
    }

    subscribe(channelId, userId) {
      const chan = this.getById(channelId);
      if (chan) chan.subscribersCount++;
      return chan;
    }
  }

  return new ChannelsComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Channels/ChannelsComponent.js'), channelsContent);
console.log('Created ChannelsComponent.js');
