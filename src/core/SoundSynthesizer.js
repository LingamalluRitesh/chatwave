/**
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
