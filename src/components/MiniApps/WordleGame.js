/**
 * ChatWave 3.0 - Wordle Game Engine
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveWordle = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const WORD_LIST = ['CLOUD', 'REACT', 'WAVES', 'CYBER', 'MUSIC', 'PHONE', 'CHATS', 'MAGIC', 'VOICE', 'SUPER'];

  class WordleGame {
    constructor() {
      this.targetWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
      this.guesses = [];
      this.currentGuess = '';
      this.isGameOver = false;
      this.isWin = false;
      this.containerId = null;
    }

    reset() {
      this.targetWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
      this.guesses = [];
      this.currentGuess = '';
      this.isGameOver = false;
      this.isWin = false;
      this.render(this.containerId);
    }

    addLetter(letter) {
      if (this.isGameOver || this.currentGuess.length >= 5) return;
      this.currentGuess += letter.toUpperCase();
      this.render(this.containerId);
    }

    deleteLetter() {
      if (this.isGameOver || this.currentGuess.length === 0) return;
      this.currentGuess = this.currentGuess.slice(0, -1);
      this.render(this.containerId);
    }

    submitGuess() {
      if (this.isGameOver || this.currentGuess.length !== 5) return;
      this.guesses.push(this.currentGuess);

      if (this.currentGuess === this.targetWord) {
        this.isGameOver = true;
        this.isWin = true;
        if (window.ChatWaveParticles) window.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 50);
        if (window.ChatWaveSound) window.ChatWaveSound.playVictory();
      } else if (this.guesses.length >= 6) {
        this.isGameOver = true;
        this.isWin = false;
        if (window.ChatWaveSound) window.ChatWaveSound.playDefeat();
      } else {
        if (window.ChatWaveSound) window.ChatWaveSound.playPop();
      }

      this.currentGuess = '';
      this.render(this.containerId);
    }

    getLetterStatus(word, index) {
      const letter = word[index];
      if (this.targetWord[index] === letter) return 'correct';
      if (this.targetWord.includes(letter)) return 'present';
      return 'absent';
    }

    render(containerId) {
      if (typeof document === "undefined") return;
      if (containerId) this.containerId = containerId;
      const host = document.getElementById(this.containerId || 'cw-wordle-container');
      if (!host) return;

      let html = `
        <div class="cw-miniapp-card">
          <div class="cw-miniapp-header">
            <div>
              <div class="cw-miniapp-title">🔤 ChatWave Wordle</div>
              <div class="cw-miniapp-subtitle">${this.isGameOver ? (this.isWin ? '🎉 You Solved It!' : 'Word was: ' + this.targetWord) : 'Guess the 5-letter word'}</div>
            </div>
            <button class="cw-btn-mini" onclick="ChatWaveWordle.reset()">🔄 Reset</button>
          </div>
          <div class="cw-wordle-grid">
      `;

      for (let r = 0; r < 6; r++) {
        html += '<div class="cw-wordle-row">';
        const guess = this.guesses[r] || (r === this.guesses.length ? this.currentGuess : '');
        for (let c = 0; c < 5; c++) {
          const letter = guess[c] || '';
          const status = this.guesses[r] ? this.getLetterStatus(this.guesses[r], c) : '';
          html += `<div class="cw-wordle-cell ${status}">${letter}</div>`;
        }
        html += '</div>';
      }

      html += `
          </div>
          <div class="cw-wordle-keyboard">
            <div class="cw-wordle-key-row">
              ${['Q','W','E','R','T','Y','U','I','O','P'].map(k => `<button class="cw-wordle-key" onclick="ChatWaveWordle.addLetter('${k}')">${k}</button>`).join('')}
            </div>
            <div class="cw-wordle-key-row">
              ${['A','S','D','F','G','H','J','K','L'].map(k => `<button class="cw-wordle-key" onclick="ChatWaveWordle.addLetter('${k}')">${k}</button>`).join('')}
            </div>
            <div class="cw-wordle-key-row">
              <button class="cw-wordle-key action" onclick="ChatWaveWordle.submitGuess()">ENTER</button>
              ${['Z','X','C','V','B','N','M'].map(k => `<button class="cw-wordle-key" onclick="ChatWaveWordle.addLetter('${k}')">${k}</button>`).join('')}
              <button class="cw-wordle-key action" onclick="ChatWaveWordle.deleteLetter()">⌫</button>
            </div>
          </div>
        </div>
      `;

      host.innerHTML = html;
    }
  }

  const game = new WordleGame();
  return {
    get gameStatus() { return game.isGameOver ? (game.isWin ? 'WON' : 'LOST') : 'IN_PROGRESS'; },
    get guesses() { return game.guesses; },
    get currentGuess() { return game.currentGuess; },
    get targetWord() { return game.targetWord; },
    render: (cId) => game.render(cId),
    addLetter: (l) => game.addLetter(l),
    deleteLetter: () => game.deleteLetter(),
    submitGuess: () => game.submitGuess(),
    reset: () => game.reset()
  };
}));
