/**
 * ChatWave 3.0 - In-Chat Interactive Soundboard FX Pad
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSoundboard = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
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
          content: `?? Played Soundboard FX: ${pad.name}`,
          data: { padId }
        });
      }
    }
  }

  return new SoundboardComponent();
}));
