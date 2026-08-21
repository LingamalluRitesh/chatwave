const fs = require('fs');
const path = require('path');

const compDir = path.join(__dirname, '../src/components');

// 10. CallModalComponent.js
const callModalContent = `/**
 * ChatWave 3.0 - HD Voice & Video Call Overlay Component
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveCallModal = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class CallModalComponent {
    constructor() {
      this.timerInterval = null;
      this.seconds = 0;
    }

    openCall(targetUser, mode = 'video') {
      let modal = document.getElementById('cw-call-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cw-call-modal';
        modal.className = 'cw-call-modal-overlay';
        document.body.appendChild(modal);
      }

      this.seconds = 0;
      modal.innerHTML = \`
        <div class="cw-call-window">
          <div class="cw-call-header">
            <div class="cw-call-target-info">
              <h3>\${targetUser.name}</h3>
              <span id="cw-call-status-timer">Connecting...</span>
            </div>
            <button class="cw-btn-icon" onclick="ChatWaveCallModal.togglePiP()" title="Picture-in-Picture">??</button>
          </div>

          <div class="cw-call-media-grid">
            <div class="cw-video-box remote-video">
              <video id="cw-remote-video-el" autoplay playsinline></video>
              <div class="cw-video-placeholder" id="cw-remote-placeholder">
                <div class="cw-call-avatar">\${targetUser.name.charAt(0)}</div>
                <span>\${targetUser.name}</span>
              </div>
            </div>
            <div class="cw-video-box local-video">
              <video id="cw-local-video-el" autoplay playsinline muted></video>
            </div>
          </div>

          <div class="cw-call-controls">
            <button class="cw-call-btn" id="cw-call-btn-mic" onclick="ChatWaveCallModal.toggleMic()" title="Toggle Microphone">??</button>
            <button class="cw-call-btn" id="cw-call-btn-cam" onclick="ChatWaveCallModal.toggleCam()" title="Toggle Camera">??</button>
            <button class="cw-call-btn" id="cw-call-btn-screen" onclick="ChatWaveCallModal.toggleScreen()" title="Share Screen">???</button>
            <button class="cw-call-btn end-call" onclick="ChatWaveCallModal.endCall()" title="End Call">??</button>
          </div>
        </div>
      \`;

      modal.classList.remove('hidden');

      if (root.ChatWaveWebRTC) {
        root.ChatWaveWebRTC.initLocalStream(mode === 'video', true).then(stream => {
          const localVid = document.getElementById('cw-local-video-el');
          if (localVid) localVid.srcObject = stream;
          this.startTimer();
          if (root.ChatWaveSound) root.ChatWaveSound.playNote(523.25, 'sine', 0.15, 0.25);
        }).catch(err => {
          console.error('Call media init error:', err);
          document.getElementById('cw-call-status-timer').textContent = 'Microphone / Camera access required';
        });
      }
    }

    startTimer() {
      clearInterval(this.timerInterval);
      const timerEl = document.getElementById('cw-call-status-timer');
      this.timerInterval = setInterval(() => {
        this.seconds++;
        const mins = Math.floor(this.seconds / 60).toString().padStart(2, '0');
        const secs = (this.seconds % 60).toString().padStart(2, '0');
        if (timerEl) timerEl.textContent = \`\${mins}:\${secs} · HD Secure Call\`;
      }, 1000);
    }

    toggleMic() {
      if (root.ChatWaveWebRTC) {
        const active = root.ChatWaveWebRTC.toggleAudio();
        const btn = document.getElementById('cw-call-btn-mic');
        if (btn) btn.classList.toggle('muted', !active);
      }
    }

    toggleCam() {
      if (root.ChatWaveWebRTC) {
        const active = root.ChatWaveWebRTC.toggleVideo();
        const btn = document.getElementById('cw-call-btn-cam');
        if (btn) btn.classList.toggle('muted', !active);
      }
    }

    toggleScreen() {
      if (root.ChatWaveWebRTC) {
        if (!root.ChatWaveWebRTC.isScreenSharing) {
          root.ChatWaveWebRTC.startScreenShare();
        } else {
          root.ChatWaveWebRTC.stopScreenShare();
        }
      }
    }

    endCall() {
      clearInterval(this.timerInterval);
      if (root.ChatWaveWebRTC) root.ChatWaveWebRTC.endAllCalls();
      if (root.ChatWaveSound) root.ChatWaveSound.playNote(392.00, 'sine', 0.2, 0.2);

      const modal = document.getElementById('cw-call-modal');
      if (modal) modal.classList.add('hidden');
    }
  }

  return new CallModalComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Calls/CallModalComponent.js'), callModalContent);
console.log('Created CallModalComponent.js');

// 11. SettingsComponent.js
const settingsContent = `/**
 * ChatWave 3.0 - User Settings & Preferences Component
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSettings = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class SettingsComponent {
    constructor() {
      this.settings = this.load();
    }

    load() {
      try {
        const s = localStorage.getItem('cw_settings_v3');
        return s ? JSON.parse(s) : {
          sounds: true,
          notifications: true,
          e2ee: true,
          theme: 'dark',
          language: 'en'
        };
      } catch(e) {
        return { sounds: true, notifications: true, e2ee: true };
      }
    }

    save() {
      localStorage.setItem('cw_settings_v3', JSON.stringify(this.settings));
      if (root.ChatWaveStateStore) root.ChatWaveStateStore.updateSettings(this.settings);
    }

    toggle(key) {
      this.settings[key] = !this.settings[key];
      this.save();
      return this.settings[key];
    }
  }

  return new SettingsComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Settings/SettingsComponent.js'), settingsContent);
console.log('Created SettingsComponent.js');

// 12. AuthModal.js
const authContent = `/**
 * ChatWave 3.0 - Multi-Step Authentication Component
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveAuth = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class AuthModal {
    constructor() {}

    simpleHash(str) {
      let h = 0;
      for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
      return Math.abs(h).toString(16).substring(0, 10);
    }
  }

  return new AuthModal();
}));
`;
fs.writeFileSync(path.join(compDir, 'Auth/AuthModal.js'), authContent);
console.log('Created AuthModal.js');
