/**
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

      // Pawn promotion to Queen
      if (piece === 'wP' && toR === 0) this.board[toR][toC] = 'wQ';
      if (piece === 'bP' && toR === 7) this.board[toR][toC] = 'bQ';

      const fromCoord = String.fromCharCode(97 + fromC) + (8 - fromR);
      const toCoord = String.fromCharCode(97 + toC) + (8 - toR);
      this.moveHistory.push(`${PIECES[piece]} ${fromCoord} → ${toCoord}`);

      if (window.ChatWaveSound) {
        if (target) window.ChatWaveSound.playPop();
        else window.ChatWaveSound.playButtonClick();
      }

      this.turn = this.turn === 'w' ? 'b' : 'w';
    }

    render(containerId) {
      if (typeof document === "undefined") return;
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
      if (window.sendMsg) {
        window.sendMsg({ type: 'text', content: `♟️ Chess Update: ${lastMove} (Turn: ${this.turn === 'w' ? 'White' : 'Black'})` });
      }
    }
  }

  const engine = new ChessEngine();
  return {
    get turn() { return engine.turn; },
    get board() { return engine.board; },
    get validMoves() { return engine.validMoves; },
    get moveHistory() { return engine.moveHistory; },
    calculateMoves: (r, c) => engine.getLegalMoves(r, c),
    getLegalMoves: (r, c) => engine.getLegalMoves(r, c),
    render: (cId) => engine.render(cId),
    selectSquare: (r, c) => engine.selectSquare(r, c),
    reset: () => engine.reset(),
    shareToChat: () => engine.shareToChat(),
    getEngine: () => engine
  };
}));
