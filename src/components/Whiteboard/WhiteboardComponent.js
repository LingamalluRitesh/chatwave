/**
 * ChatWave 3.0 - Collaborative Real-Time Whiteboard Canvas
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveWhiteboard = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  class WhiteboardComponent {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.isDrawing = false;
      this.tool = 'brush'; // 'brush' | 'eraser' | 'line' | 'rect' | 'circle'
      this.color = '#00a884';
      this.size = 4;
      this.history = [];
      this.historyIndex = -1;
      this.startX = 0;
      this.startY = 0;
      this.snapshot = null;
    }

    init(canvasId = 'cw-whiteboard-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.bindEvents();
      this.saveState();
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.ctx.fillStyle = '#111b21';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    bindEvents() {
      if (!this.canvas) return;

      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      };

      const start = (e) => {
        e.preventDefault();
        this.isDrawing = true;
        const pos = getPos(e);
        this.startX = pos.x;
        this.startY = pos.y;
        this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
      };

      const move = (e) => {
        if (!this.isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);

        if (this.tool === 'brush' || this.tool === 'eraser') {
          this.ctx.strokeStyle = this.tool === 'eraser' ? '#111b21' : this.color;
          this.ctx.lineWidth = this.size * (this.tool === 'eraser' ? 3 : 1);
          this.ctx.lineCap = 'round';
          this.ctx.lineJoin = 'round';
          this.ctx.lineTo(pos.x, pos.y);
          this.ctx.stroke();
        } else {
          this.ctx.putImageData(this.snapshot, 0, 0);
          this.ctx.strokeStyle = this.color;
          this.ctx.lineWidth = this.size;
          this.ctx.lineCap = 'round';
          
          if (this.tool === 'line') {
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
          } else if (this.tool === 'rect') {
            this.ctx.strokeRect(this.startX, this.startY, pos.x - this.startX, pos.y - this.startY);
          } else if (this.tool === 'circle') {
            const rad = Math.sqrt(Math.pow(pos.x - this.startX, 2) + Math.pow(pos.y - this.startY, 2));
            this.ctx.beginPath();
            this.ctx.arc(this.startX, this.startY, rad, 0, Math.PI * 2);
            this.ctx.stroke();
          }
        }
      };

      const end = (e) => {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.ctx.closePath();
        this.saveState();
      };

      this.canvas.addEventListener('mousedown', start);
      this.canvas.addEventListener('mousemove', move);
      this.canvas.addEventListener('mouseup', end);
      this.canvas.addEventListener('touchstart', start, { passive: false });
      this.canvas.addEventListener('touchmove', move, { passive: false });
      this.canvas.addEventListener('touchend', end);
    }

    saveState() {
      if (!this.ctx || !this.canvas) return;
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
      if (this.history.length > 20) this.history.shift();
      else this.historyIndex++;
    }

    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
      }
    }

    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
      }
    }

    clear() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.fillStyle = '#111b21';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.saveState();
    }

    setTool(tool) {
      this.tool = tool;
    }

    setColor(color) {
      this.color = color;
    }

    setSize(size) {
      this.size = parseInt(size, 10);
    }

    exportImage() {
      if (!this.canvas) return null;
      return this.canvas.toDataURL('image/png');
    }

    sendToChat() {
      const dataUrl = this.exportImage();
      if (dataUrl && root.ChatWaveApp) {
        root.ChatWaveApp.sendMessage({
          type: 'image',
          url: dataUrl,
          content: '?? Whiteboard sketch'
        });
        if (root.ChatWaveApp.toast) root.ChatWaveApp.toast('Drawing sent to chat! ??', 'success');
      }
    }
  }

  return new WhiteboardComponent();
}));
