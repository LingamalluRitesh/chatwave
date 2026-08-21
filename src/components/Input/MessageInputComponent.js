/**
 * ChatWave 3.0 - Message Input Component with Voice Recorder, Slash Commands, and Dropzone
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveMessageInput = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  class MessageInputComponent {
    constructor() {
      this.isRecordingVoice = false;
      this.mediaRecorder = null;
      this.audioChunks = [];
    }

    async toggleVoiceRecording() {
      if (!this.isRecordingVoice) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.mediaRecorder = new MediaRecorder(stream);
          this.audioChunks = [];
          this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
          this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onload = () => {
              if (root.ChatWaveApp) {
                root.ChatWaveApp.sendMessage({
                  type: 'audio',
                  url: reader.result,
                  content: '?? Voice note'
                });
              }
            };
            reader.readAsDataURL(blob);
          };
          this.mediaRecorder.start();
          this.isRecordingVoice = true;
          if (root.ChatWaveApp.toast) root.ChatWaveApp.toast('??? Recording voice note...', 'info');
        } catch (e) {
          console.error('Audio recording failed:', e);
        }
      } else {
        if (this.mediaRecorder) {
          this.mediaRecorder.stop();
          this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
        }
        this.isRecordingVoice = false;
      }
    }
  }

  return new MessageInputComponent();
}));
