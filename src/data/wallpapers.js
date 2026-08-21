/**
 * ChatWave 3.0 - Curated Chat Wallpaper Patterns & Gradients
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveWallpapers = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  const WALLPAPERS = [
    {
      id: 'default_dark',
      name: 'Default ChatWave Dark',
      type: 'gradient',
      css: 'radial-gradient(circle at 15% 15%, rgba(0, 168, 132, 0.12) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(11, 20, 26, 0.8) 0%, transparent 40%), #111b21',
      thumb: '#111b21'
    },
    {
      id: 'whatsapp_doodle',
      name: 'WhatsApp Classic Doodles',
      type: 'pattern',
      css: 'url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300a884' fill-opacity='0.06' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E"), #111b21',
      thumb: '#005c4b'
    },
    {
      id: 'cyberpunk_neon',
      name: 'Cyberpunk Neon Matrix',
      type: 'gradient',
      css: 'linear-gradient(135deg, #090d16 0%, #1e1035 50%, #061e2d 100%)',
      thumb: '#1e1035'
    },
    {
      id: 'emerald_aurora',
      name: 'Emerald Aurora',
      type: 'gradient',
      css: 'radial-gradient(ellipse at bottom, #064e3b 0%, #022c22 45%, #051410 100%)',
      thumb: '#064e3b'
    },
    {
      id: 'nordic_night',
      name: 'Nordic Midnight',
      type: 'gradient',
      css: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      thumb: '#0f172a'
    },
    {
      id: 'sunset_glow',
      name: 'Sunset Glow',
      type: 'gradient',
      css: 'linear-gradient(135deg, #2b1055 0%, #75225b 50%, #b33939 100%)',
      thumb: '#75225b'
    },
    {
      id: 'minimal_light',
      name: 'Paper Cream Light',
      type: 'gradient',
      css: '#efeae2',
      thumb: '#efeae2'
    }
  ];

  return {
    getAll: () => WALLPAPERS,
    getById: (id) => WALLPAPERS.find(w => w.id === id) || WALLPAPERS[0]
  };
}));
