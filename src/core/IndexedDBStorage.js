/**
 * ChatWave 3.0 - Offline-First IndexedDB Storage Layer
 * Stores messages, contacts, media blobs, drafts, vault files, and preferences with indexes.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveIndexedDB = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const DB_NAME = 'ChatWaveOfflineDB';
  const DB_VERSION = 2;

  class IndexedDBStorage {
    constructor() {
      this.db = null;
      this.readyPromise = this.initDB();
    }

    initDB() {
      return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
          console.warn('IndexedDB not supported in this environment');
          return resolve(null);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          if (!db.objectStoreNames.contains('messages')) {
            const msgStore = db.createObjectStore('messages', { keyPath: 'id' });
            msgStore.createIndex('chatId', 'chatId', { unique: false });
            msgStore.createIndex('created_at', 'created_at', { unique: false });
          }

          if (!db.objectStoreNames.contains('chats')) {
            db.createObjectStore('chats', { keyPath: 'id' });
          }

          if (!db.objectStoreNames.contains('vault')) {
            const vaultStore = db.createObjectStore('vault', { keyPath: 'id' });
            vaultStore.createIndex('type', 'type', { unique: false });
            vaultStore.createIndex('timestamp', 'timestamp', { unique: false });
          }

          if (!db.objectStoreNames.contains('drafts')) {
            db.createObjectStore('drafts', { keyPath: 'chatId' });
          }

          if (!db.objectStoreNames.contains('media_cache')) {
            db.createObjectStore('media_cache', { keyPath: 'url' });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.error('IndexedDB open error:', event.target.error);
          resolve(null);
        };
      });
    }

    async saveMessage(msg) {
      await this.readyPromise;
      if (!this.db || !msg || !msg.id) return;
      return new Promise((resolve) => {
        const tx = this.db.transaction('messages', 'readwrite');
        const store = tx.objectStore('messages');
        store.put(msg);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }

    async getMessagesForChat(chatId, limit = 100) {
      await this.readyPromise;
      if (!this.db) return [];
      return new Promise((resolve) => {
        const tx = this.db.transaction('messages', 'readonly');
        const store = tx.objectStore('messages');
        const index = store.index('chatId');
        const req = index.getAll(chatId);
        req.onsuccess = () => {
          const res = req.result || [];
          res.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
          resolve(res.slice(-limit));
        };
        req.onerror = () => resolve([]);
      });
    }

    async saveDraft(chatId, text) {
      await this.readyPromise;
      if (!this.db) return;
      return new Promise((resolve) => {
        const tx = this.db.transaction('drafts', 'readwrite');
        const store = tx.objectStore('drafts');
        if (text) store.put({ chatId, text, updatedAt: Date.now() });
        else store.delete(chatId);
        tx.oncomplete = () => resolve(true);
      });
    }

    async getDraft(chatId) {
      await this.readyPromise;
      if (!this.db) return '';
      return new Promise((resolve) => {
        const tx = this.db.transaction('drafts', 'readonly');
        const store = tx.objectStore('drafts');
        const req = store.get(chatId);
        req.onsuccess = () => resolve(req.result ? req.result.text : '');
        req.onerror = () => resolve('');
      });
    }

    async saveVaultFile(fileObj) {
      await this.readyPromise;
      if (!this.db) return;
      return new Promise((resolve) => {
        const tx = this.db.transaction('vault', 'readwrite');
        const store = tx.objectStore('vault');
        store.put(fileObj);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    }

    async getVaultFiles() {
      await this.readyPromise;
      if (!this.db) return [];
      return new Promise((resolve) => {
        const tx = this.db.transaction('vault', 'readonly');
        const store = tx.objectStore('vault');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }

    async clearAllData() {
      await this.readyPromise;
      if (!this.db) return;
      const stores = ['messages', 'chats', 'vault', 'drafts', 'media_cache'];
      for (const s of stores) {
        try {
          const tx = this.db.transaction(s, 'readwrite');
          tx.objectStore(s).clear();
        } catch (e) {}
      }
    }
  }

  return new IndexedDBStorage();
}));
