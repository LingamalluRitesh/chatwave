/**
 * ChatWave 3.0 - 2048 Tile Sliding Game Engine
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWave2048 = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class Game2048 {
    constructor() {
      this.grid = this.getEmptyGrid();
      this.score = 0;
      this.highScore = 0;
      this.isGameOver = false;
      this.containerId = null;
      this.addRandomTile();
      this.addRandomTile();
    }

    getEmptyGrid() {
      return Array(4).fill(null).map(() => Array(4).fill(0));
    }

    reset() {
      this.grid = this.getEmptyGrid();
      this.score = 0;
      this.isGameOver = false;
      this.addRandomTile();
      this.addRandomTile();
      this.render(this.containerId);
    }

    addRandomTile() {
      const emptyCells = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (this.grid[r][c] === 0) emptyCells.push({ r, c });
        }
      }
      if (emptyCells.length === 0) return;
      const rand = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[rand.r][rand.c] = Math.random() < 0.9 ? 2 : 4;
    }

    slide(row) {
      let arr = row.filter(val => val !== 0);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          this.score += arr[i];
          arr[i + 1] = 0;
        }
      }
      arr = arr.filter(val => val !== 0);
      while (arr.length < 4) arr.push(0);
      return arr;
    }

    move(dir) {
      if (this.isGameOver) return;
      let changed = false;
      const prevGrid = JSON.stringify(this.grid);

      if (dir === 'left') {
        for (let r = 0; r < 4; r++) {
          this.grid[r] = this.slide(this.grid[r]);
        }
      } else if (dir === 'right') {
        for (let r = 0; r < 4; r++) {
          this.grid[r] = this.slide(this.grid[r].reverse()).reverse();
        }
      } else if (dir === 'up') {
        for (let c = 0; c < 4; c++) {
          let col = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
          col = this.slide(col);
          for (let r = 0; r < 4; r++) this.grid[r][c] = col[r];
        }
      } else if (dir === 'down') {
        for (let c = 0; c < 4; c++) {
          let col = [this.grid[3][c], this.grid[2][c], this.grid[1][c], this.grid[0][c]];
          col = this.slide(col);
          for (let r = 0; r < 4; r++) this.grid[3 - r][c] = col[r];
        }
      }

      if (JSON.stringify(this.grid) !== prevGrid) {
        this.addRandomTile();
        if (window.ChatWaveSound) window.ChatWaveSound.playButtonClick();
      }

      if (this.score > this.highScore) this.highScore = this.score;
      this.render(this.containerId);
    }

    render(containerId) {
      if (typeof document === "undefined") return;
      if (containerId) this.containerId = containerId;
      const host = document.getElementById(this.containerId || 'cw-2048-container');
      if (!host) return;

      let html = `
        <div class="cw-miniapp-card">
          <div class="cw-miniapp-header">
            <div>
              <div class="cw-miniapp-title">🔢 2048 Puzzle</div>
              <div class="cw-miniapp-subtitle">Score: <b>${this.score}</b> | Best: <b>${this.highScore}</b></div>
            </div>
            <button class="cw-btn-mini" onclick="ChatWave2048.reset()">🔄 Reset</button>
          </div>
          <div class="cw-2048-grid">
      `;

      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const val = this.grid[r][c];
          html += `<div class="cw-2048-tile tile-${val}">${val > 0 ? val : ''}</div>`;
        }
      }

      html += `
          </div>
          <div class="cw-2048-controls">
            <button class="cw-dpad-btn up" onclick="ChatWave2048.move('up')">▲</button>
            <div class="cw-dpad-row">
              <button class="cw-dpad-btn left" onclick="ChatWave2048.move('left')">◀</button>
              <button class="cw-dpad-btn down" onclick="ChatWave2048.move('down')">▼</button>
              <button class="cw-dpad-btn right" onclick="ChatWave2048.move('right')">▶</button>
            </div>
          </div>
        </div>
      `;

      host.innerHTML = html;
    }
  }

  const game = new Game2048();
  return {
    render: (cId) => game.render(cId),
    move: (dir) => game.move(dir),
    reset: () => game.reset()
  };
}));
