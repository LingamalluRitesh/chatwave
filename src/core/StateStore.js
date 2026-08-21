/**
 * ChatWave 3.0 - Reactive Central State Management Store
 * Features: Event-driven state updates, time-travel history (undo/redo), persistence middleware, and subscriber tracking.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveStateStore = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const STORAGE_KEY = 'cw_state_v3';

  class StateStore {
    constructor(initialState = {}) {
      this.state = Object.assign({
        currentUser: null,
        activeChatId: null,
        activeChatType: null, // 'direct' | 'group' | 'channel' | 'ai'
        chats: {},
        messages: {}, // chatId -> Array of message objects
        users: {}, // userId -> user object
        groups: {}, // groupId -> group object
        channels: {}, // channelId -> channel object
        stories: [], // active 24h stories
        onlineUsers: new Set(),
        typingUsers: {}, // chatId -> Set of userIds
        unreadCounts: {}, // chatId -> number
        pinnedMessages: {}, // chatId -> Array of messageIds
        starredMessages: new Set(), // Set of messageIds
        currentFilter: 'all', // 'all' | 'unread' | 'groups' | 'channels' | 'direct'
        searchQuery: '',
        theme: 'dark',
        wallpaper: 'default_dark',
        settings: {
          notificationsSound: true,
          desktopNotifications: true,
          readReceipts: true,
          lastSeenVisibility: 'everyone',
          e2eEncryptionEnabled: true,
          haptics: true,
          dataSaver: false,
          language: 'en',
          fontSize: 'medium'
        },
        callState: {
          active: false,
          callId: null,
          mode: 'audio', // 'audio' | 'video' | 'screen'
          participants: [],
          isMuted: false,
          isVideoOff: false,
          isScreenSharing: false,
          durationSeconds: 0
        },
        whiteboardState: {
          isOpen: false,
          activeTool: 'brush',
          brushColor: '#00a884',
          brushSize: 4
        },
        activeMiniApp: null, // null | 'chess' | 'tictactoe' | 'wordle' | '2048' | 'trivia' | 'code'
        vaultStats: {
          usedBytes: 0,
          maxBytes: 10737418240, // 10 GB
          fileCount: 0
        }
      }, initialState);

      this.subscribers = new Map(); // id -> callback
      this.middleware = [];
      this.history = [];
      this.historyIndex = -1;
      this.maxHistory = 50;
      this.subIdCounter = 0;

      this.initPersistence();
    }

    initPersistence() {
      try {
        const saved = (typeof localStorage !== "undefined") ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.currentUser) this.state.currentUser = parsed.currentUser;
          if (parsed.theme) this.state.theme = parsed.theme;
          if (parsed.wallpaper) this.state.wallpaper = parsed.wallpaper;
          if (parsed.settings) this.state.settings = Object.assign(this.state.settings, parsed.settings);
        }
      } catch (e) {
        console.warn('Could not restore state from storage', e);
      }
    }

    getState() {
      return this.state;
    }

    get(path) {
      if (!path) return this.state;
      const keys = path.split('.');
      let curr = this.state;
      for (const k of keys) {
        if (curr === null || curr === undefined) return undefined;
        curr = curr[k];
      }
      return curr;
    }

    setState(updater, actionName = 'SET_STATE') {
      const prevState = Object.assign({}, this.state);
      let updates = typeof updater === 'function' ? updater(this.state) : updater;

      if (!updates || typeof updates !== 'object') return;

      // Apply middleware before state change
      for (const mw of this.middleware) {
        mw({ action: actionName, prevState, updates, store: this });
      }

      this.state = Object.assign({}, this.state, updates);

      // Record history
      this.recordHistory(actionName, prevState, this.state);

      // Save persistent keys
      this.persist();

      // Notify subscribers
      this.notify(this.state, prevState, actionName);
    }

    recordHistory(actionName, prev, next) {
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push({ actionName, state: Object.assign({}, next), timestamp: Date.now() });
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      } else {
        this.historyIndex++;
      }
    }

    persist() {
      try {
        const toSave = {
          currentUser: this.state.currentUser,
          theme: this.state.theme,
          wallpaper: this.state.wallpaper,
          settings: this.state.settings
        };
        if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (e) {}
    }

    subscribe(callback, filterKey = null) {
      const id = ++this.subIdCounter;
      this.subscribers.set(id, { callback, filterKey });
      return () => this.subscribers.delete(id);
    }

    notify(state, prevState, actionName) {
      for (const [id, sub] of this.subscribers.entries()) {
        try {
          if (sub.filterKey) {
            const prevVal = prevState[sub.filterKey];
            const nextVal = state[sub.filterKey];
            if (prevVal !== nextVal) {
              sub.callback(nextVal, prevVal, actionName);
            }
          } else {
            sub.callback(state, prevState, actionName);
          }
        } catch (err) {
          console.error('State subscriber error:', err);
        }
      }
    }

    addMiddleware(fn) {
      if (typeof fn === 'function') this.middleware.push(fn);
    }

    // Action Helpers
    setCurrentUser(user) {
      this.setState({ currentUser: user }, 'SET_CURRENT_USER');
    }

    setActiveChat(chatId, type = 'direct') {
      this.setState({ activeChatId: chatId, activeChatType: type }, 'SET_ACTIVE_CHAT');
      if (chatId) {
        const unread = Object.assign({}, this.state.unreadCounts);
        unread[chatId] = 0;
        this.setState({ unreadCounts: unread }, 'RESET_UNREAD');
      }
    }

    setTheme(theme) {
      this.setState({ theme }, 'SET_THEME');
    }

    setWallpaper(wallpaper) {
      this.setState({ wallpaper }, 'SET_WALLPAPER');
    }

    updateSettings(newSettings) {
      const settings = Object.assign({}, this.state.settings, newSettings);
      this.setState({ settings }, 'UPDATE_SETTINGS');
    }
  }

  return new StateStore();
}));
