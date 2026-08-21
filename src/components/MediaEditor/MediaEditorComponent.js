/**
 * ChatWave 3.0 - In-Browser Media & Image Editor
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveMediaEditor = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  class MediaEditorComponent {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.currentImage = null;
      this.filter = 'normal';
    }

    loadImage(src, canvasId = 'cw-media-editor-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.currentImage = img;
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.render();
      };
      img.src = src;
    }

    applyFilter(filterName) {
      this.filter = filterName;
      this.render();
    }

    render() {
      if (!this.ctx || !this.currentImage) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.filter === 'grayscale') this.ctx.filter = 'grayscale(100%)';
      else if (this.filter === 'sepia') this.ctx.filter = 'sepia(100%)';
      else if (this.filter === 'cyber') this.ctx.filter = 'hue-rotate(180deg) saturate(200%)';
      else if (this.filter === 'vintage') this.ctx.filter = 'contrast(120%) brightness(90%) sepia(40%)';
      else this.ctx.filter = 'none';

      this.ctx.drawImage(this.currentImage, 0, 0);
    }

    exportEdited() {
      if (!this.canvas) return null;
      return this.canvas.toDataURL('image/jpeg', 0.9);
    }
  }

  return new MediaEditorComponent();
}));
