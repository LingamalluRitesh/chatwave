/**
 * ChatWave 3.0 - Canvas-based Interactive Particle & Reaction Burst Engine
 * Supports Confetti explosions, Heart bursts, Fire celebration, Stars, and Floating Emojis.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveParticles = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class ParticleEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.animId = null;
      this.initCanvas();
    }

    initCanvas() {
      if (typeof document === 'undefined') return;
      let el = document.getElementById('cw-particles-canvas');
      if (!el) {
        el = document.createElement('canvas');
        el.id = 'cw-particles-canvas';
        el.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;';
        document.body.appendChild(el);
      }
      this.canvas = el;
      this.ctx = el.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      this.canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      if (this.ctx) {
        this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    }

    burst(x, y, count = 30, colors = ['#00a884', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 8;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          radius: 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          gravity: 0.25,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.2,
          shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
      }
      this.startLoop();
    }

    burstHearts(x, y, count = 16) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          char: '??',
          size: 16 + Math.random() * 14,
          alpha: 1,
          decay: 0.02,
          gravity: 0.15,
          isEmoji: true
        });
      }
      this.startLoop();
    }

    burstEmoji(x, y, emoji = '??', count = 12) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          char: emoji,
          size: 18 + Math.random() * 12,
          alpha: 1,
          decay: 0.018,
          gravity: 0.2,
          isEmoji: true
        });
      }
      this.startLoop();
    }

    startLoop() {
      if (!this.animId) {
        this.animId = requestAnimationFrame(() => this.loop());
      }
    }

    loop() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.isEmoji) {
          this.ctx.font = `${p.size}px sans-serif`;
          this.ctx.fillText(p.char, p.x, p.y);
        } else if (p.shape === 'rect') {
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rotation += p.vRot);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.fill();
        }

        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
      }
    }
  }

  return new ParticleEngine();
}));
