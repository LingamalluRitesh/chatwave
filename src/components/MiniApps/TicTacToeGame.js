/**
 * ChatWave 3.0 - Real-Time In-Chat Tic-Tac-Toe
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveTicTacToe = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class TicTacToeGame {
    constructor() {
      this.board = Array(9).fill(null);
      this.turn = 'X';
      this.winner = null;
      this.winningLine = null;
      this.scores = { X: 0, O: 0, draws: 0 };
      this.containerId = null;
    }

    reset() {
      this.board = Array(9).fill(null);
      this.turn = 'X';
      this.winner = null;
      this.winningLine = null;
      this.render(this.containerId);
    }

    makeMove(idx) {
      if (this.board[idx] || this.winner) return;

      this.board[idx] = this.turn;
      if (window.ChatWaveSound) window.ChatWaveSound.playButtonClick();

      this.checkWinner();
      if (!this.winner) {
        this.turn = this.turn === 'X' ? 'O' : 'X';
      }
      this.render(this.containerId);
    }

    checkWinner() {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];

      for (const line of lines) {
        const [a, b, c] = line;
        if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
          this.winner = this.board[a];
          this.winningLine = line;
          this.scores[this.winner]++;
          if (window.ChatWaveParticles) window.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 40);
          if (window.ChatWaveSound) window.ChatWaveSound.playVictory();
          return;
        }
      }

      if (!this.board.includes(null)) {
        this.winner = 'draw';
        this.scores.draws++;
        if (window.ChatWaveSound) window.ChatWaveSound.playDefeat();
      }
    }

    render(containerId) {
      if (typeof document === "undefined") return;
      if (containerId) this.containerId = containerId;
      const host = document.getElementById(this.containerId || 'cw-tictactoe-container');
      if (!host) return;

      const statusText = this.winner === 'draw'
        ? "🤝 It's a Draw!"
        : this.winner
        ? `🎉 Player ${this.winner} Wins!`
        : `Turn: Player ${this.turn}`;

      let html = `
        <div class="cw-miniapp-card">
          <div class="cw-miniapp-header">
            <div>
              <div class="cw-miniapp-title">🎮 Tic-Tac-Toe</div>
              <div class="cw-miniapp-subtitle">${statusText}</div>
            </div>
            <button class="cw-btn-mini" onclick="ChatWaveTicTacToe.reset()">🔄 Reset</button>
          </div>
          <div class="cw-ttt-grid">
      `;

      for (let i = 0; i < 9; i++) {
        const val = this.board[i];
        const isWin = this.winningLine && this.winningLine.includes(i);
        html += `
          <button class="cw-ttt-cell ${val ? val.toLowerCase() : ''} ${isWin ? 'win' : ''}"
                  onclick="ChatWaveTicTacToe.makeMove(${i})"
                  ${val || this.winner ? 'disabled' : ''}>
            ${val || ''}
          </button>
        `;
      }

      html += `
          </div>
          <div class="cw-ttt-score">
            <span>Player X: <b>${this.scores.X}</b></span>
            <span>Draws: <b>${this.scores.draws}</b></span>
            <span>Player O: <b>${this.scores.O}</b></span>
          </div>
        </div>
      `;

      host.innerHTML = html;
    }
  }

  const game = new TicTacToeGame();
  return {
    render: (cId) => game.render(cId),
    makeMove: (i) => game.makeMove(i),
    reset: () => game.reset()
  };
}));
