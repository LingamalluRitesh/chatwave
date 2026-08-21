/**
 * ChatWave 3.0 - Sidebar Component with search, filter pills, pinned chats, and presence
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSidebar = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  class SidebarComponent {
    constructor() {
      this.filter = 'all';
      this.search = '';
    }

    setFilter(filterName) {
      this.filter = filterName;
      if (root.ChatWaveApp) root.ChatWaveApp.renderChatList();
    }

    setSearch(query) {
      this.search = (query || '').toLowerCase().trim();
      if (root.ChatWaveApp) root.ChatWaveApp.renderChatList();
    }
  }

  return new SidebarComponent();
}));
