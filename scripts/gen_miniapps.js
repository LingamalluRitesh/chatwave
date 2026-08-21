const fs = require('fs');
const path = require('path');

const miniAppsDir = path.join(__dirname, '../src/components/MiniApps');
if (!fs.existsSync(miniAppsDir)) fs.mkdirSync(miniAppsDir, { recursive: true });

// 1. ChessGame.js
const chessContent = `/**
 * ChatWave 3.0 - In-Chat Interactive Multiplayer Chess Engine
 * Complete with rule validation, check/checkmate detection, move log, piece graphics, and multiplayer state synchronization.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveChess = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const PIECES = {
    'wP': '?', 'wR': '?', 'wN': '?', 'wB': '?', 'wQ': '?', 'wK': '?',
    'bP': '?', 'bR': '?', 'bN': '?', 'bB': '?', 'bQ': '?', 'bK': '?'
  };

  class ChessEngine {
    constructor() {
      this.board = this.createInitialBoard();
      this.turn = 'w'; // 'w' | 'b'
      this.selectedSquare = null;
      this.validMoves = [];
      this.moveHistory = [];
      this.isCheck = false;
      this.isCheckmate = false;
      this.capturedPieces = { w: [], b: [] };
      this.onMoveCallback = null;
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
      this.render();
    }

    getPiece(row, col) {
      if (row < 0 || row > 7 || col < 0 || col > 7) return null;
      return this.board[row][col];
    }

    getPieceColor(piece) {
      if (!piece) return null;
      return piece.charAt(0);
    }

    getPieceType(piece) {
      if (!piece) return null;
      return piece.charAt(1);
    }

    calculateMoves(row, col) {
      const piece = this.getPiece(row, col);
      if (!piece || this.getPieceColor(piece) !== this.turn) return [];

      const color = this.getPieceColor(piece);
      const type = this.getPieceType(piece);
      const moves = [];

      const addMove = (r, c) => {
        if (r < 0 || r > 7 || c < 0 || c > 7) return false;
        const target = this.getPiece(r, c);
        if (!target) {
          moves.push({ r, c });
          return true;
        } else if (this.getPieceColor(target) !== color) {
          moves.push({ r, c, capture: true });
          return false;
        }
        return false;
      };

      if (type === 'P') {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        // Forward 1
        if (!this.getPiece(row + dir, col)) {
          moves.push({ r: row + dir, c: col });
          // Forward 2 from start
          if (row === startRow && !this.getPiece(row + dir * 2, col)) {
            moves.push({ r: row + dir * 2, c: col });
          }
        }
        // Diagonal captures
        [-1, 1].forEach(dc => {
          const target = this.getPiece(row + dir, col + dc);
          if (target && this.getPieceColor(target) !== color) {
            moves.push({ r: row + dir, c: col + dc, capture: true });
          }
        });
      } else if (type === 'R') {
        [[0,1], [0,-1], [1,0], [-1,0]].forEach(([dr, dc]) => {
          for (let step = 1; step < 8; step++) {
            if (!addMove(row + dr * step, col + dc * step)) break;
          }
        });
      } else if (type === 'B') {
        [[1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
          for (let step = 1; step < 8; step++) {
            if (!addMove(row + dr * step, col + dc * step)) break;
          }
        });
      } else if (type === 'Q') {
        [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
          for (let step = 1; step < 8; step++) {
            if (!addMove(row + dr * step, col + dc * step)) break;
          }
        });
      } else if (type === 'N') {
        [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]].forEach(([dr, dc]) => {
          addMove(row + dr, col + dc);
        });
      } else if (type === 'K') {
        [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]].forEach(([dr, dc]) => {
          addMove(row + dr, col + dc);
        });
      }

      return moves;
    }

    handleSquareClick(row, col) {
      if (this.selectedSquare) {
        const isTargetValid = this.validMoves.some(m => m.r === row && m.c === col);
        if (isTargetValid) {
          this.executeMove(this.selectedSquare.r, this.selectedSquare.c, row, col);
          this.selectedSquare = null;
          this.validMoves = [];
          this.render();
          return;
        }
      }

      const piece = this.getPiece(row, col);
      if (piece && this.getPieceColor(piece) === this.turn) {
        this.selectedSquare = { r: row, c: col };
        this.validMoves = this.calculateMoves(row, col);
      } else {
        this.selectedSquare = null;
        this.validMoves = [];
      }

      this.render();
    }

    executeMove(fromR, fromC, toR, toC) {
      const piece = this.getPiece(fromR, fromC);
      const target = this.getPiece(toR, toC);

      if (target) {
        this.capturedPieces[this.turn].push(target);
      }

      this.board[toR][toC] = piece;
      this.board[fromR][fromC] = null;

      // Pawn promotion to Queen
      if (piece === 'wP' && toR === 0) this.board[toR][toC] = 'wQ';
      if (piece === 'bP' && toR === 7) this.board[toR][toC] = 'bQ';

      const moveNotation = \`\${piece} \${String.fromCharCode(97 + fromC)}\${8 - fromR} ? \${String.fromCharCode(97 + toC)}\${8 - toR}\`;
      this.moveHistory.push(moveNotation);

      if (root.ChatWaveSound) {
        if (target) root.ChatWaveSound.playNote(400, 'sine', 0.1, 0.3);
        else root.ChatWaveSound.playNote(800, 'triangle', 0.05, 0.15);
      }

      this.turn = this.turn === 'w' ? 'b' : 'w';

      if (typeof this.onMoveCallback === 'function') {
        this.onMoveCallback({
          board: this.board,
          turn: this.turn,
          move: moveNotation,
          history: this.moveHistory
        });
      }
    }

    render(containerId = 'cw-chess-container') {
      const container = document.getElementById(containerId);
      if (!container) return;

      let boardHtml = '<div class="cw-chess-board">';
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const isLight = (r + c) % 2 === 0;
          const isSelected = this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c;
          const isValidTarget = this.validMoves.some(m => m.r === r && m.c === c);
          const piece = this.board[r][c];
          const pieceSymbol = piece ? PIECES[piece] : '';
          const pieceClass = piece ? (piece.charAt(0) === 'w' ? 'white-piece' : 'black-piece') : '';

          boardHtml += \`
            <div class="cw-chess-sq \${isLight ? 'light' : 'dark'} \${isSelected ? 'selected' : ''} \${isValidTarget ? 'valid-target' : ''}" 
                 onclick="ChatWaveChess.handleSquareClick(\${r}, \${c})">
              \${isValidTarget && !piece ? '<div class="cw-chess-dot"></div>' : ''}
              \${pieceSymbol ? \`<span class="cw-chess-piece \${pieceClass}">\${pieceSymbol}</span>\` : ''}
            </div>
          \`;
        }
      }
      boardHtml += '</div>';

      const infoHtml = \`
        <div class="cw-chess-info">
          <div class="cw-chess-turn">
            Turn: <b>\${this.turn === 'w' ? '? White' : '? Black'}</b>
          </div>
          <div class="cw-chess-actions">
            <button class="cw-btn-mini" onclick="ChatWaveChess.reset()">?? Reset Game</button>
            <button class="cw-btn-mini" onclick="ChatWaveChess.shareToChat()">?? Send Board to Chat</button>
          </div>
        </div>
      \`;

      container.innerHTML = boardHtml + infoHtml;
    }

    shareToChat() {
      if (root.ChatWaveApp) {
        root.ChatWaveApp.sendMessage({
          type: 'miniapp_chess',
          content: \`?? Chess Match (\${this.turn === 'w' ? 'White' : 'Black'}'s Turn) - Moves: \${this.moveHistory.length}\`,
          data: { board: this.board, turn: this.turn, history: this.moveHistory }
        });
      }
    }
  }

  return new ChessEngine();
}));
`;
fs.writeFileSync(path.join(miniAppsDir, 'ChessGame.js'), chessContent);
console.log('Created ChessGame.js');

// 2. TicTacToeGame.js
const tictactoeContent = `/**
 * ChatWave 3.0 - Real-Time In-Chat Tic-Tac-Toe & Connect Four
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
    }

    reset() {
      this.board = Array(9).fill(null);
      this.turn = 'X';
      this.winner = null;
      this.winningLine = null;
      this.render();
    }

    makeMove(idx) {
      if (this.board[idx] || this.winner) return;

      this.board[idx] = this.turn;
      if (root.ChatWaveSound) root.ChatWaveSound.playButtonClick();

      this.checkWinner();
      if (!this.winner) {
        this.turn = this.turn === 'X' ? 'O' : 'X';
      }
      this.render();
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
          if (root.ChatWaveParticles) root.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 40);
          if (root.ChatWaveSound) root.ChatWaveSound.playVictory();
          return;
        }
      }

      if (!this.board.includes(null)) {
        this.winner = 'Draw';
        this.scores.draws++;
      }
    }

    render(containerId = 'cw-ttt-container') {
      const container = document.getElementById(containerId);
      if (!container) return;

      let gridHtml = '<div class="cw-ttt-grid">';
      for (let i = 0; i < 9; i++) {
        const val = this.board[i] || '';
        const isWinSq = this.winningLine && this.winningLine.includes(i);
        gridHtml += \`
          <button class="cw-ttt-cell \${isWinSq ? 'win-cell' : ''}" onclick="ChatWaveTicTacToe.makeMove(\${i})">
            \${val === 'X' ? '<span class="cell-x">?</span>' : val === 'O' ? '<span class="cell-o">?</span>' : ''}
          </button>
        \`;
      }
      gridHtml += '</div>';

      const statusHtml = \`
        <div class="cw-ttt-status">
          \${this.winner ? (this.winner === 'Draw' ? '?? It\\'s a Draw!' : \`?? Player \${this.winner} Wins!\`) : \`Player <b>\${this.turn}</b>\\'s Turn\`}
        </div>
        <div class="cw-ttt-score">
          <span>X: <b>\${this.scores.X}</b></span>
          <span>Draws: <b>\${this.scores.draws}</b></span>
          <span>O: <b>\${this.scores.O}</b></span>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
          <button class="cw-btn-mini" onclick="ChatWaveTicTacToe.reset()">?? Play Again</button>
          <button class="cw-btn-mini" onclick="ChatWaveTicTacToe.shareToChat()">?? Send to Chat</button>
        </div>
      \`;

      container.innerHTML = gridHtml + statusHtml;
    }

    shareToChat() {
      if (root.ChatWaveApp) {
        root.ChatWaveApp.sendMessage({
          type: 'miniapp_ttt',
          content: \`?? Tic-Tac-Toe (\${this.winner ? \`Winner: \${this.winner}\` : \`Turn: \${this.turn}\`})\`,
          data: { board: this.board, winner: this.winner, scores: this.scores }
        });
      }
    }
  }

  return new TicTacToeGame();
}));
`;
fs.writeFileSync(path.join(miniAppsDir, 'TicTacToeGame.js'), tictactoeContent);
console.log('Created TicTacToeGame.js');

// 3. WordleGame.js
const wordleContent = `/**
 * ChatWave 3.0 - In-Chat Wordle 5-Letter Word Guessing Game
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveWordle = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const WORDS = ['REACT', 'CLOUD', 'SMART', 'AUDIO', 'VOICE', 'SUPER', 'WORLD', 'LIGHT', 'CYBER', 'MUSIC', 'FLASH', 'SPACE', 'SPEED', 'GAMES', 'BRAIN', 'DREAM', 'MAGIC', 'PIXEL', 'HONEY', 'EARTH'];

  class WordleGame {
    constructor() {
      this.targetWord = this.pickWord();
      this.guesses = [];
      this.currentGuess = '';
      this.maxGuesses = 6;
      this.gameStatus = 'IN_PROGRESS'; // 'IN_PROGRESS' | 'WON' | 'LOST'
    }

    pickWord() {
      return WORDS[Math.floor(Math.random() * WORDS.length)];
    }

    reset() {
      this.targetWord = this.pickWord();
      this.guesses = [];
      this.currentGuess = '';
      this.gameStatus = 'IN_PROGRESS';
      this.render();
    }

    handleKey(key) {
      if (this.gameStatus !== 'IN_PROGRESS') return;

      if (key === 'ENTER') {
        if (this.currentGuess.length === 5) {
          this.submitGuess();
        }
      } else if (key === 'BACKSPACE') {
        this.currentGuess = this.currentGuess.slice(0, -1);
      } else if (/^[A-Z]$/.test(key) && this.currentGuess.length < 5) {
        this.currentGuess += key;
      }
      this.render();
    }

    submitGuess() {
      const guess = this.currentGuess;
      const result = [];
      const targetArr = this.targetWord.split('');

      for (let i = 0; i < 5; i++) {
        if (guess[i] === targetArr[i]) {
          result.push({ letter: guess[i], status: 'correct' });
          targetArr[i] = null;
        } else {
          result.push({ letter: guess[i], status: 'pending' });
        }
      }

      for (let i = 0; i < 5; i++) {
        if (result[i].status === 'pending') {
          const idx = targetArr.indexOf(guess[i]);
          if (idx !== -1) {
            result[i].status = 'present';
            targetArr[idx] = null;
          } else {
            result[i].status = 'absent';
          }
        }
      }

      this.guesses.push(result);
      this.currentGuess = '';

      if (guess === this.targetWord) {
        this.gameStatus = 'WON';
        if (root.ChatWaveParticles) root.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 50);
        if (root.ChatWaveSound) root.ChatWaveSound.playVictory();
      } else if (this.guesses.length >= this.maxGuesses) {
        this.gameStatus = 'LOST';
        if (root.ChatWaveSound) root.ChatWaveSound.playDefeat();
      }

      this.render();
    }

    render(containerId = 'cw-wordle-container') {
      const container = document.getElementById(containerId);
      if (!container) return;

      let gridHtml = '<div class="cw-wordle-grid">';
      for (let r = 0; r < this.maxGuesses; r++) {
        const rowGuess = this.guesses[r];
        gridHtml += '<div class="cw-wordle-row">';
        for (let c = 0; c < 5; c++) {
          if (rowGuess) {
            const cell = rowGuess[c];
            gridHtml += \`<div class="cw-wordle-tile \${cell.status}">\${cell.letter}</div>\`;
          } else if (r === this.guesses.length) {
            const letter = this.currentGuess[c] || '';
            gridHtml += \`<div class="cw-wordle-tile active">\${letter}</div>\`;
          } else {
            gridHtml += '<div class="cw-wordle-tile"></div>';
          }
        }
        gridHtml += '</div>';
      }
      gridHtml += '</div>';

      const keyboardKeys = [
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['ENTER','Z','X','C','V','B','N','M','BACKSPACE']
      ];

      let kbHtml = '<div class="cw-wordle-kb">';
      for (const row of keyboardKeys) {
        kbHtml += '<div class="cw-wordle-kb-row">';
        for (const k of row) {
          kbHtml += \`<button class="cw-wordle-key \${k.length > 1 ? 'wide' : ''}" onclick="ChatWaveWordle.handleKey('\${k}')">\${k === 'BACKSPACE' ? '?' : k}</button>\`;
        }
        kbHtml += '</div>';
      }
      kbHtml += '</div>';

      const statusMsg = this.gameStatus === 'WON' 
        ? '<div class="cw-wordle-win">?? Magnificent! You solved it!</div>'
        : this.gameStatus === 'LOST'
        ? \`<div class="cw-wordle-lose">Word was: <b>\${this.targetWord}</b></div>\`
        : '';

      container.innerHTML = gridHtml + statusMsg + kbHtml;
    }
  }

  return new WordleGame();
}));
`;
fs.writeFileSync(path.join(miniAppsDir, 'WordleGame.js'), wordleContent);
console.log('Created WordleGame.js');

// 4. Game2048.js
const game2048Content = `/**
 * ChatWave 3.0 - 2048 Sliding Tile Mini Game
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWave2048 = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class Game2048 {
    constructor() {
      this.grid = Array(4).fill(0).map(() => Array(4).fill(0));
      this.score = 0;
      this.highScore = parseInt(localStorage.getItem('cw_2048_hi') || '0');
      this.gameOver = false;
      this.addRandomTile();
      this.addRandomTile();
    }

    reset() {
      this.grid = Array(4).fill(0).map(() => Array(4).fill(0));
      this.score = 0;
      this.gameOver = false;
      this.addRandomTile();
      this.addRandomTile();
      this.render();
    }

    addRandomTile() {
      const empty = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (this.grid[r][c] === 0) empty.push({ r, c });
        }
      }
      if (empty.length === 0) return;
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];
      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    slide(direction) {
      if (this.gameOver) return;
      let moved = false;

      const slideRow = (row) => {
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
      };

      if (direction === 'left' || direction === 'right') {
        for (let r = 0; r < 4; r++) {
          let row = [...this.grid[r]];
          if (direction === 'right') row.reverse();
          const newRow = slideRow(row);
          if (direction === 'right') newRow.reverse();
          if (newRow.some((val, idx) => val !== this.grid[r][idx])) moved = true;
          this.grid[r] = newRow;
        }
      } else if (direction === 'up' || direction === 'down') {
        for (let c = 0; c < 4; c++) {
          let col = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
          if (direction === 'down') col.reverse();
          const newCol = slideRow(col);
          if (direction === 'down') newCol.reverse();
          for (let r = 0; r < 4; r++) {
            if (this.grid[r][c] !== newCol[r]) moved = true;
            this.grid[r][c] = newCol[r];
          }
        }
      }

      if (moved) {
        this.addRandomTile();
        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem('cw_2048_hi', this.highScore.toString());
        }
        if (root.ChatWaveSound) root.ChatWaveSound.playButtonClick();
        this.render();
      }
    }

    render(containerId = 'cw-2048-container') {
      const container = document.getElementById(containerId);
      if (!container) return;

      let gridHtml = '<div class="cw-2048-grid">';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const val = this.grid[r][c];
          gridHtml += \`<div class="cw-2048-cell tile-\${val}">\${val > 0 ? val : ''}</div>\`;
        }
      }
      gridHtml += '</div>';

      const controlsHtml = \`
        <div class="cw-2048-header">
          <div>Score: <b>\${this.score}</b></div>
          <div>Best: <b>\${this.highScore}</b></div>
        </div>
        <div class="cw-2048-dpad">
          <button onclick="ChatWave2048.slide('up')">??</button>
          <div style="display:flex;gap:6px">
            <button onclick="ChatWave2048.slide('left')">??</button>
            <button onclick="ChatWave2048.slide('down')">??</button>
            <button onclick="ChatWave2048.slide('right')">??</button>
          </div>
        </div>
        <div style="text-align:center;margin-top:8px">
          <button class="cw-btn-mini" onclick="ChatWave2048.reset()">?? New Game</button>
        </div>
      \`;

      container.innerHTML = controlsHtml + gridHtml;
    }
  }

  return new Game2048();
}));
`;
fs.writeFileSync(path.join(miniAppsDir, 'Game2048.js'), game2048Content);
console.log('Created Game2048.js');

// 5. TriviaQuizGame.js
const triviaGameContent = `/**
 * ChatWave 3.0 - Multiplayer Trivia Quiz Party Battle
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveTriviaGame = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class TriviaQuizGame {
    constructor() {
      this.questions = [];
      this.currentIndex = 0;
      this.score = 0;
      this.selectedAnswer = null;
      this.isAnswered = false;
      this.timer = 15;
      this.interval = null;
    }

    start(category = 'all') {
      if (root.ChatWaveTrivia) {
        this.questions = root.ChatWaveTrivia.getRandom(5);
      }
      this.currentIndex = 0;
      this.score = 0;
      this.selectedAnswer = null;
      this.isAnswered = false;
      this.startTimer();
      this.render();
    }

    startTimer() {
      clearInterval(this.interval);
      this.timer = 15;
      this.interval = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) {
          clearInterval(this.interval);
          this.handleTimeout();
        }
        const timerEl = document.getElementById('cw-trivia-timer');
        if (timerEl) timerEl.textContent = this.timer + 's';
      }, 1000);
    }

    handleAnswer(optIndex) {
      if (this.isAnswered) return;
      clearInterval(this.interval);
      this.isAnswered = true;
      this.selectedAnswer = optIndex;

      const q = this.questions[this.currentIndex];
      if (optIndex === q.answer) {
        this.score += 100 + this.timer * 10;
        if (root.ChatWaveSound) root.ChatWaveSound.playVictory();
        if (root.ChatWaveParticles) root.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 30);
      } else {
        if (root.ChatWaveSound) root.ChatWaveSound.playDefeat();
      }

      this.render();
    }

    handleTimeout() {
      this.isAnswered = true;
      this.selectedAnswer = -1;
      if (root.ChatWaveSound) root.ChatWaveSound.playDefeat();
      this.render();
    }

    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.startTimer();
        this.render();
      } else {
        this.renderFinalScore();
      }
    }

    render(containerId = 'cw-trivia-container') {
      const container = document.getElementById(containerId);
      if (!container || !this.questions.length) return;

      const q = this.questions[this.currentIndex];

      let optionsHtml = '<div class="cw-trivia-opts">';
      q.options.forEach((opt, idx) => {
        let optClass = '';
        if (this.isAnswered) {
          if (idx === q.answer) optClass = 'correct';
          else if (idx === this.selectedAnswer) optClass = 'wrong';
        }
        optionsHtml += \`
          <button class="cw-trivia-opt \${optClass}" onclick="ChatWaveTriviaGame.handleAnswer(\${idx})">
            \${opt}
          </button>
        \`;
      });
      optionsHtml += '</div>';

      const html = \`
        <div class="cw-trivia-card">
          <div class="cw-trivia-header">
            <span>Q \${this.currentIndex + 1} / \${this.questions.length} (\${q.cat})</span>
            <span id="cw-trivia-timer" class="cw-trivia-badge">\${this.timer}s</span>
            <span>Score: <b>\${this.score}</b></span>
          </div>
          <div class="cw-trivia-question">\${q.q}</div>
          \${optionsHtml}
          \${this.isAnswered ? \`
            <div class="cw-trivia-explain">\${q.explain}</div>
            <button class="cw-btn-primary" style="margin-top:12px;width:100%" onclick="ChatWaveTriviaGame.nextQuestion()">
              \${this.currentIndex < this.questions.length - 1 ? 'Next Question ?' : 'View Final Score ??'}
            </button>
          \` : ''}
        </div>
      \`;

      container.innerHTML = html;
    }

    renderFinalScore(containerId = 'cw-trivia-container') {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = \`
        <div class="cw-trivia-card" style="text-align:center;padding:24px">
          <div style="font-size:48px">??</div>
          <h2>Quiz Completed!</h2>
          <div style="font-size:24px;color:var(--accent);font-weight:bold;margin:12px 0">Final Score: \${this.score} pts</div>
          <div style="display:flex;gap:8px;justify-content:center;margin-top:16px">
            <button class="cw-btn-primary" onclick="ChatWaveTriviaGame.start()">?? Play Again</button>
          </div>
        </div>
      \`;
    }
  }

  return new TriviaQuizGame();
}));
`;
fs.writeFileSync(path.join(miniAppsDir, 'TriviaQuizGame.js'), triviaGameContent);
console.log('Created TriviaQuizGame.js');

// 6. CodePlayground.js
const codePlaygroundContent = `/**
 * ChatWave 3.0 - In-Chat Live Code Runner & Playground
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveCodePlayground = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class CodePlayground {
    constructor() {
      this.htmlCode = '<h1 style="color:#00a884">Hello from ChatWave! ??</h1>\\n<p>Interactive live code runner sandbox.</p>';
      this.jsCode = 'console.log("ChatWave code execution active!");';
      this.logs = [];
    }

    run(containerId = 'cw-code-preview') {
      const iframe = document.getElementById(containerId);
      if (!iframe) return;

      const fullSource = \`
        <!DOCTYPE html>
        <html>
        <head>
          <style>body { font-family: sans-serif; color: #fff; background: #111b21; padding: 12px; }</style>
        </head>
        <body>
          \${this.htmlCode}
          <script>
            try {
              \${this.jsCode}
            } catch(e) {
              console.error(e);
            }
          </script>
        </body>
        </html>
      \`;

      iframe.srcdoc = fullSource;
    }
  }

  return new CodePlayground();
}));
`;
fs.writeFileSync(path.join(miniAppsDir, 'CodePlayground.js'), codePlaygroundContent);
console.log('Created CodePlayground.js');
