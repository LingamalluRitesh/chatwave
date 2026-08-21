/**
 * ChatWave 3.0 - Encrypted Cloud Vault & Storage Manager
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveVault = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  class VaultComponent {
    constructor() {
      this.files = [];
      this.totalUsedBytes = 0;
      this.maxBytes = 10 * 1024 * 1024 * 1024; // 10 GB
      this.loadFiles();
    }

    async loadFiles() {
      if (root.ChatWaveIndexedDB) {
        this.files = await root.ChatWaveIndexedDB.getVaultFiles();
        this.calcStorage();
      }
    }

    calcStorage() {
      this.totalUsedBytes = this.files.reduce((acc, f) => acc + (f.size || 0), 0);
    }

    async addFile(fileBlob, name, type = 'document') {
      const fileObj = {
        id: 'vault_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name,
        type,
        size: fileBlob.size || 1024,
        url: URL.createObjectURL(fileBlob),
        timestamp: Date.now()
      };

      this.files.push(fileObj);
      this.calcStorage();

      if (root.ChatWaveIndexedDB) {
        await root.ChatWaveIndexedDB.saveVaultFile(fileObj);
      }

      return fileObj;
    }

    getFilesByType(type) {
      if (!type || type === 'all') return this.files;
      return this.files.filter(f => f.type === type);
    }
  }

  return new VaultComponent();
}));
