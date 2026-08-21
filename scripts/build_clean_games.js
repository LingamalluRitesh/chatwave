const fs = require('fs');
const path = require('path');

// ==========================================
// 1. ChessGame.js
// ==========================================
const chessCode = `/**
 * ChatWave 3.0 - In-Chat Interactive Multiplayer Chess Engine
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveChess = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const PIECES = {
    'wP': '♙', 'wR': '♖', 'wN': '♘', 'wB': '♗', 'wQ': '♕', 'wK': '♔',
    'bP': '♟', 'bR': '♜', 'bN': '♞', 'bB': '♝', 'bQ': '♛', 'bK': '♚'
  };

  class ChessEngine {
    constructor() {
      this.board = this.createInitialBoard();
      this.turn = 'w';
      this.selectedSquare = null;
      this.validMoves = [];
      this.moveHistory = [];
      this.isCheck = false;
      this.isCheckmate = false;
      this.capturedPieces = { w: [], b: [] };
      this.containerId = null;
    }

    createInitialBoard() {
      return [
        ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
        ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
        ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
      ];
    }

    reset() {
      this.board = this.createInitialBoard();
      this.turn = 'w';
      this.selectedSquare = null;
      this.validMoves = [];
      this.moveHistory = [];
      this.isCheck = false;
      this.isCheckmate = false;
      this.capturedPieces = { w: [], b: [] };
      this.render(this.containerId);
    }

    getPiece(row, col) {
      if (row < 0 || row > 7 || col < 0 || col > 7) return null;
      return this.board[row][col];
    }

    getPieceColor(piece) {
      return piece ? piece[0] : null;
    }

    getPieceType(piece) {
      return piece ? piece[1] : null;
    }

    getLegalMoves(row, col) {
      const piece = this.getPiece(row, col);
      if (!piece || this.getPieceColor(piece) !== this.turn) return [];
      const type = this.getPieceType(piece);
      const color = this.getPieceColor(piece);
      let moves = [];

      if (type === 'P') {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        if (!this.getPiece(row + dir, col)) {
          moves.push({ r: row + dir, c: col });
          if (row === startRow && !this.getPiece(row + 2 * dir, col)) {
            moves.push({ r: row + 2 * dir, c: col });
          }
        }
        [-1, 1].forEach(dc => {
          const target = this.getPiece(row + dir, col + dc);
          if (target && this.getPieceColor(target) !== color) {
            moves.push({ r: row + dir, c: col + dc });
          }
        });
      } else if (type === 'N') {
        const deltas = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        deltas.forEach(([dr, dc]) => {
          const r = row + dr, c = col + dc;
          if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const target = this.getPiece(r, c);
            if (!target || this.getPieceColor(target) !== color) {
              moves.push({ r, c });
            }
          }
        });
      } else if (type === 'B' || type === 'R' || type === 'Q') {
        const dirs = [];
        if (type === 'B' || type === 'Q') dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
        if (type === 'R' || type === 'Q') dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);

        dirs.forEach(([dr, dc]) => {
          let r = row + dr, c = col + dc;
          while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const target = this.getPiece(r, c);
            if (!target) {
              moves.push({ r, c });
            } else {
              if (this.getPieceColor(target) !== color) moves.push({ r, c });
              break;
            }
            r += dr;
            c += dc;
          }
        });
      } else if (type === 'K') {
        const dirs = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ];
        dirs.forEach(([dr, dc]) => {
          const r = row + dr, c = col + dc;
          if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const target = this.getPiece(r, c);
            if (!target || this.getPieceColor(target) !== color) {
              moves.push({ r, c });
            }
          }
        });
      }

      return moves;
    }

    selectSquare(row, col) {
      if (this.isCheckmate) return;
      const piece = this.getPiece(row, col);

      if (this.selectedSquare) {
        const isMove = this.validMoves.some(m => m.r === row && m.c === col);
        if (isMove) {
          this.executeMove(this.selectedSquare.r, this.selectedSquare.c, row, col);
          this.selectedSquare = null;
          this.validMoves = [];
          this.render(this.containerId);
          return;
        }
      }

      if (piece && this.getPieceColor(piece) === this.turn) {
        this.selectedSquare = { r: row, c: col };
        this.validMoves = this.getLegalMoves(row, col);
      } else {
        this.selectedSquare = null;
        this.validMoves = [];
      }
      this.render(this.containerId);
    }

    executeMove(fromR, fromC, toR, toC) {
      const piece = this.board[fromR][fromC];
      const target = this.board[toR][toC];

      if (target) {
        this.capturedPieces[this.turn].push(target);
      }

      this.board[toR][toC] = piece;
      this.board[fromR][fromC] = null;

      if (piece === 'wP' && toR === 0) this.board[toR][toC] = 'wQ';
      if (piece === 'bP' && toR === 7) this.board[toR][toC] = 'bQ';

      const fromCoord = String.fromCharCode(97 + fromC) + (8 - fromR);
      const toCoord = String.fromCharCode(97 + toC) + (8 - toR);
      this.moveHistory.push(`${PIECES[piece]} ${fromCoord} → ${toCoord}`);

      if (typeof window !== 'undefined' && window.ChatWaveSound) {
        if (target) window.ChatWaveSound.playPop();
        else window.ChatWaveSound.playButtonClick();
      }

      this.turn = this.turn === 'w' ? 'b' : 'w';
    }

    render(containerId) {
      if (typeof document === 'undefined') return;
      if (containerId) this.containerId = containerId;
      const host = document.getElementById(this.containerId || 'cw-chess-container');
      if (!host) return;

      let html = `
        <div class="cw-miniapp-card">
          <div class="cw-miniapp-header">
            <div>
              <div class="cw-miniapp-title">♟️ ChatWave Chess</div>
              <div class="cw-miniapp-subtitle">Turn: ${this.turn === 'w' ? '⚪ White (You)' : '⚫ Black'}</div>
            </div>
            <button class="cw-btn-mini" onclick="ChatWaveChess.reset()">🔄 Reset</button>
          </div>
          <div class="cw-chess-board-wrap">
            <div class="cw-chess-board">
      `;

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const isLight = (r + c) % 2 === 0;
          const piece = this.board[r][c];
          const isSelected = this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c;
          const isTarget = this.validMoves.some(m => m.r === r && m.c === c);

          html += `
            <div class="cw-chess-sq ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isTarget ? 'target' : ''}"
                 onclick="ChatWaveChess.selectSquare(${r}, ${c})">
              ${piece ? `<span class="cw-chess-piece ${piece[0]}">${PIECES[piece] || ''}</span>` : ''}
              ${isTarget ? '<div class="cw-chess-dot"></div>' : ''}
            </div>
          `;
        }
      }

      html += `
            </div>
          </div>
          <div class="cw-chess-footer">
            <div style="font-size:12px;color:var(--text-muted)">
              Captured: ${this.capturedPieces.w.map(p => PIECES[p]).join(' ')} | ${this.capturedPieces.b.map(p => PIECES[p]).join(' ')}
            </div>
            <button class="cw-btn-primary" style="padding:6px 12px;font-size:12px" onclick="ChatWaveChess.shareToChat()">Share Move 💬</button>
          </div>
        </div>
      `;

      host.innerHTML = html;
    }

    shareToChat() {
      const lastMove = this.moveHistory[this.moveHistory.length - 1] || 'Game started';
      if (typeof sendMsg === 'function') {
        sendMsg({ type: 'text', content: `♟️ Chess Update: ${lastMove} (Turn: ${this.turn === 'w' ? 'White' : 'Black'})` });
      }
    }
  }

  const engine = new ChessEngine();
  return {
    render: (cId) => engine.render(cId),
    selectSquare: (r, c) => engine.selectSquare(r, c),
    reset: () => engine.reset(),
    shareToChat: () => engine.shareToChat(),
    getEngine: () => engine
  };
}));
`;

fs.writeFileSync(path.join(__dirname, '../src/components/MiniApps/ChessGame.js'), chessCode, 'utf8');

// ==========================================
// 2. TicTacToeGame.js
// ==========================================
const tttCode = `/**
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
      if (typeof window !== 'undefined' && window.ChatWaveSound) window.ChatWaveSound.playButtonClick();

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
          if (typeof window !== 'undefined') {
            if (window.ChatWaveParticles) window.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 40);
            if (window.ChatWaveSound) window.ChatWaveSound.playVictory();
          }
          return;
        }
      }

      if (!this.board.includes(null)) {
        this.winner = 'draw';
        this.scores.draws++;
        if (typeof window !== 'undefined' && window.ChatWaveSound) window.ChatWaveSound.playDefeat();
      }
    }

    render(containerId) {
      if (typeof document === 'undefined') return;
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
`;

fs.writeFileSync(path.join(__dirname, '../src/components/MiniApps/TicTacToeGame.js'), tttCode, 'utf8');

// ==========================================
// 3. WordleGame.js
// ==========================================
const wordleCode = `/**
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
        if (typeof window !== 'undefined') {
          if (window.ChatWaveParticles) window.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 50);
          if (window.ChatWaveSound) window.ChatWaveSound.playVictory();
        }
      } else if (this.guesses.length >= 6) {
        this.isGameOver = true;
        this.isWin = false;
        if (typeof window !== 'undefined' && window.ChatWaveSound) window.ChatWaveSound.playDefeat();
      } else {
        if (typeof window !== 'undefined' && window.ChatWaveSound) window.ChatWaveSound.playPop();
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
      if (typeof document === 'undefined') return;
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
    render: (cId) => game.render(cId),
    addLetter: (l) => game.addLetter(l),
    deleteLetter: () => game.deleteLetter(),
    submitGuess: () => game.submitGuess(),
    reset: () => game.reset()
  };
}));
`;

fs.writeFileSync(path.join(__dirname, '../src/components/MiniApps/WordleGame.js'), wordleCode, 'utf8');

// ==========================================
// 4. Game2048.js
// ==========================================
const g2048Code = `/**
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
        if (typeof window !== 'undefined' && window.ChatWaveSound) window.ChatWaveSound.playButtonClick();
      }

      if (this.score > this.highScore) this.highScore = this.score;
      this.render(this.containerId);
    }

    render(containerId) {
      if (typeof document === 'undefined') return;
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
`;

fs.writeFileSync(path.join(__dirname, '../src/components/MiniApps/Game2048.js'), g2048Code, 'utf8');

// ==========================================
// 5. TriviaQuizGame.js
// ==========================================
const triviaCode = `/**
 * ChatWave 3.0 - Interactive Trivia Quiz Party
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveTriviaGame = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const QUESTIONS = [
    { q: "What does HTML stand for?", opts: ["HyperText Markup Language", "HighText Machine Language", "Hyperlink Text Mode", "Home Tool Markup"], ans: 0 },
    { q: "Which planet is known as the Red Planet?", opts: ["Venus", "Mars", "Jupiter", "Saturn"], ans: 1 },
    { q: "What is the speed of light in vacuum?", opts: ["300,000 km/s", "150,000 km/s", "1,000 km/s", "30,000 km/s"], ans: 0 },
    { q: "Who wrote 'Romeo and Juliet'?", opts: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], ans: 1 },
    { q: "What is the capital of Japan?", opts: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], ans: 2 }
  ];

  class TriviaQuiz {
    constructor() {
      this.questions = QUESTIONS;
      this.currentIdx = 0;
      this.score = 0;
      this.selectedAnswer = null;
      this.isFinished = false;
      this.containerId = null;
    }

    start(category, containerId) {
      if (containerId) this.containerId = containerId;
      this.currentIdx = 0;
      this.score = 0;
      this.selectedAnswer = null;
      this.isFinished = false;
      this.render();
    }

    chooseAnswer(index) {
      if (this.selectedAnswer !== null || this.isFinished) return;
      this.selectedAnswer = index;
      const isCorrect = index === this.questions[this.currentIdx].ans;

      if (isCorrect) {
        this.score += 100;
        if (typeof window !== 'undefined') {
          if (window.ChatWaveSound) window.ChatWaveSound.playVictory();
          if (window.ChatWaveParticles) window.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 30);
        }
      } else {
        if (typeof window !== 'undefined' && window.ChatWaveSound) window.ChatWaveSound.playDefeat();
      }

      this.render();
      setTimeout(() => {
        if (this.currentIdx + 1 < this.questions.length) {
          this.currentIdx++;
          this.selectedAnswer = null;
          this.render();
        } else {
          this.isFinished = true;
          this.render();
        }
      }, 1400);
    }

    render() {
      if (typeof document === 'undefined') return;
      const host = document.getElementById(this.containerId || 'cw-miniapp-host');
      if (!host) return;

      if (this.isFinished) {
        host.innerHTML = `
          <div class="cw-miniapp-card" style="text-align:center;padding:32px 16px">
            <div style="font-size:48px;margin-bottom:12px">🏆</div>
            <div class="cw-miniapp-title">Quiz Completed!</div>
            <div style="font-size:18px;font-weight:700;color:var(--accent);margin:12px 0">Final Score: ${this.score} pts</div>
            <button class="cw-btn-primary" style="padding:10px 24px" onclick="ChatWaveTriviaGame.start('all')">Play Again 🔄</button>
          </div>
        `;
        return;
      }

      const q = this.questions[this.currentIdx];
      let html = `
        <div class="cw-miniapp-card">
          <div class="cw-miniapp-header">
            <div>
              <div class="cw-miniapp-title">🏆 Trivia Quiz</div>
              <div class="cw-miniapp-subtitle">Question ${this.currentIdx + 1} of ${this.questions.length} | Score: ${this.score}</div>
            </div>
          </div>
          <div style="font-size:16px;font-weight:600;margin:16px 0;line-height:1.4">${q.q}</div>
          <div class="cw-trivia-options">
      `;

      q.opts.forEach((opt, idx) => {
        let cls = 'cw-trivia-opt';
        if (this.selectedAnswer !== null) {
          if (idx === q.ans) cls += ' correct';
          else if (idx === this.selectedAnswer) cls += ' wrong';
        }
        html += `<button class="${cls}" onclick="ChatWaveTriviaGame.chooseAnswer(${idx})">${opt}</button>`;
      });

      html += `
          </div>
        </div>
      `;

      host.innerHTML = html;
    }
  }

  const quiz = new TriviaQuiz();
  return {
    start: (cat, cId) => quiz.start(cat, cId),
    chooseAnswer: (idx) => quiz.chooseAnswer(idx)
  };
}));
`;

fs.writeFileSync(path.join(__dirname, '../src/components/MiniApps/TriviaQuizGame.js'), triviaCode, 'utf8');
console.log('All 5 mini-apps updated with guards.');
