/**
 * ChatWave 3.0 - Synthesized Audio Frequencies & Sound Presets
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSoundPresets = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  return {
    messageReceived: [
      { freq: 587.33, type: 'sine', duration: 0.1, gain: 0.2 },
      { freq: 880.00, type: 'sine', duration: 0.25, gain: 0.25, delay: 0.08 }
    ],
    messageSent: [
      { freq: 740.00, type: 'triangle', duration: 0.08, gain: 0.15 },
      { freq: 1108.73, type: 'sine', duration: 0.12, gain: 0.2, delay: 0.06 }
    ],
    callRinging: [
      { freq: 440, type: 'sine', duration: 0.4, gain: 0.3 },
      { freq: 480, type: 'sine', duration: 0.4, gain: 0.3 },
      { freq: 440, type: 'sine', duration: 0.4, gain: 0.3, delay: 0.6 },
      { freq: 480, type: 'sine', duration: 0.4, gain: 0.3, delay: 0.6 }
    ],
    callConnect: [
      { freq: 523.25, type: 'sine', duration: 0.15, gain: 0.25 },
      { freq: 659.25, type: 'sine', duration: 0.15, gain: 0.25, delay: 0.12 },
      { freq: 783.99, type: 'sine', duration: 0.25, gain: 0.3, delay: 0.24 }
    ],
    callHangup: [
      { freq: 493.88, type: 'sine', duration: 0.15, gain: 0.25 },
      { freq: 392.00, type: 'sine', duration: 0.25, gain: 0.2, delay: 0.12 }
    ],
    buttonClick: [
      { freq: 1200, type: 'triangle', duration: 0.03, gain: 0.08 }
    ],
    reactionPop: [
      { freq: 300, endFreq: 900, type: 'sine', duration: 0.12, gain: 0.22 }
    ],
    gameWin: [
      { freq: 523.25, type: 'triangle', duration: 0.12, gain: 0.25 },
      { freq: 659.25, type: 'triangle', duration: 0.12, gain: 0.25, delay: 0.1 },
      { freq: 783.99, type: 'triangle', duration: 0.12, gain: 0.25, delay: 0.2 },
      { freq: 1046.50, type: 'sine', duration: 0.35, gain: 0.3, delay: 0.3 }
    ],
    gameLose: [
      { freq: 392.00, type: 'sawtooth', duration: 0.18, gain: 0.2 },
      { freq: 349.23, type: 'sawtooth', duration: 0.18, gain: 0.2, delay: 0.15 },
      { freq: 329.63, type: 'sawtooth', duration: 0.18, gain: 0.2, delay: 0.3 },
      { freq: 261.63, type: 'sawtooth', duration: 0.35, gain: 0.25, delay: 0.45 }
    ],
    laserZap: [
      { freq: 1800, endFreq: 150, type: 'sawtooth', duration: 0.15, gain: 0.2 }
    ],
    aiTypingChime: [
      { freq: 987.77, type: 'sine', duration: 0.05, gain: 0.05 }
    ]
  };
}));
