/**
 * ChatWave 3.0 - Dynamic Theme Studio & Color Customizer
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveThemeStudio = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  const PRESET_THEMES = [
    { id: 'dark', name: 'ChatWave Dark Classic', bg: '#111b21', accent: '#00a884', sec: '#202c33', text: '#e9edef' },
    { id: 'light', name: 'ChatWave Cream Light', bg: '#efeae2', accent: '#00a884', sec: '#ffffff', text: '#111b21' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon 2077', bg: '#090d16', accent: '#06b6d4', sec: '#1e1b4b', text: '#f8fafc' },
    { id: 'oled_black', name: 'Pitch Black OLED', bg: '#000000', accent: '#3b82f6', sec: '#121212', text: '#ffffff' },
    { id: 'emerald', name: 'Emerald Forest', bg: '#06281e', accent: '#10b981', sec: '#0e3d30', text: '#ecfdf5' },
    { id: 'sunset', name: 'Sunset Glow', bg: '#1c1024', accent: '#f97316', sec: '#2e183b', text: '#fff7ed' },
    { id: 'amethyst', name: 'Amethyst Royal', bg: '#190d2e', accent: '#a855f7', sec: '#281447', text: '#faf5ff' },
    { id: 'nordic', name: 'Nordic Frost', bg: '#0f172a', accent: '#38bdf8', sec: '#1e293b', text: '#f0f9ff' }
  ];

  class ThemeStudioComponent {
    constructor() {
      this.currentTheme = this.loadTheme();
      this.applyTheme(this.currentTheme);
    }

    loadTheme() {
      return localStorage.getItem('cw_theme') || 'dark';
    }

    applyTheme(themeId) {
      document.documentElement.setAttribute('data-theme', themeId);
      localStorage.setItem('cw_theme', themeId);
      this.currentTheme = themeId;
      if (root.ChatWaveStateStore) root.ChatWaveStateStore.setTheme(themeId);
    }

    setCustomColor(prop, value) {
      document.documentElement.style.setProperty(prop, value);
    }

    getPresets() {
      return PRESET_THEMES;
    }
  }

  return new ThemeStudioComponent();
}));
