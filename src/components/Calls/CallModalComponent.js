/**
 * ChatWave 3.0 - HD Voice & Video Call Overlay Component
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveCallModal = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
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
      modal.innerHTML = `
        <div class="cw-call-window">
          <div class="cw-call-header">
            <div class="cw-call-target-info">
              <h3>${targetUser.name}</h3>
              <span id="cw-call-status-timer">Connecting...</span>
            </div>
            <button class="cw-btn-icon" onclick="ChatWaveCallModal.togglePiP()" title="Picture-in-Picture">??</button>
          </div>

          <div class="cw-call-media-grid">
            <div class="cw-video-box remote-video">
              <video id="cw-remote-video-el" autoplay playsinline></video>
              <div class="cw-video-placeholder" id="cw-remote-placeholder">
                <div class="cw-call-avatar">${targetUser.name.charAt(0)}</div>
                <span>${targetUser.name}</span>
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
      `;

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
        if (timerEl) timerEl.textContent = `${mins}:${secs} � HD Secure Call`;
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
