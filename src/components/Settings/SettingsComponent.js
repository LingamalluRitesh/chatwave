/**
 * ChatWave 3.0 - User Settings & Preferences Component
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSettings = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  class SettingsComponent {
    constructor() {
      this.settings = this.load();
    }

    load() {
      try {
        const s = localStorage.getItem('cw_settings_v3');
        return s ? JSON.parse(s) : {
          sounds: true,
          notifications: true,
          e2ee: true,
          theme: 'dark',
          language: 'en'
        };
      } catch(e) {
        return { sounds: true, notifications: true, e2ee: true };
      }
    }

    save() {
      localStorage.setItem('cw_settings_v3', JSON.stringify(this.settings));
      if (root.ChatWaveStateStore) root.ChatWaveStateStore.updateSettings(this.settings);
    }

    toggle(key) {
      this.settings[key] = !this.settings[key];
      this.save();
      return this.settings[key];
    }
  }

  return new SettingsComponent();
}));
