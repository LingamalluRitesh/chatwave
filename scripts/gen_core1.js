const fs = require('fs');
const path = require('path');

const coreDir = path.join(__dirname, '../src/core');
if (!fs.existsSync(coreDir)) fs.mkdirSync(coreDir, { recursive: true });

// 1. StateStore.js
const stateStoreContent = `/**
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
        const saved = localStorage.getItem(STORAGE_KEY);
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
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
`;
fs.writeFileSync(path.join(coreDir, 'StateStore.js'), stateStoreContent);
console.log('Created StateStore.js');

// 2. EventBus.js
const eventBusContent = `/**
 * ChatWave 3.0 - High-Performance Asynchronous Event Bus
 * Supports Wildcard namespaces, prioritization, once listeners, and event tracing.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveEventBus = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class EventBus {
    constructor() {
      this.listeners = new Map();
      this.history = [];
      this.maxHistory = 100;
    }

    on(event, handler, priority = 0) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      const entry = { handler, priority, once: false };
      const list = this.listeners.get(event);
      list.push(entry);
      list.sort((a, b) => b.priority - a.priority);
      return () => this.off(event, handler);
    }

    once(event, handler, priority = 0) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      const entry = { handler, priority, once: true };
      const list = this.listeners.get(event);
      list.push(entry);
      list.sort((a, b) => b.priority - a.priority);
      return () => this.off(event, handler);
    }

    off(event, handler) {
      if (!this.listeners.has(event)) return;
      const list = this.listeners.get(event);
      const idx = list.findIndex(e => e.handler === handler);
      if (idx !== -1) list.splice(idx, 1);
      if (list.length === 0) this.listeners.delete(event);
    }

    emit(event, payload = {}) {
      this.history.push({ event, payload, timestamp: Date.now() });
      if (this.history.length > this.maxHistory) this.history.shift();

      // Direct listeners
      if (this.listeners.has(event)) {
        const list = [...this.listeners.get(event)];
        for (const entry of list) {
          try {
            entry.handler(payload, event);
            if (entry.once) this.off(event, entry.handler);
          } catch (err) {
            console.error(\`EventBus error in "\${event}":\`, err);
          }
        }
      }

      // Wildcard listeners (e.g. 'chat:*')
      for (const [evtName, list] of this.listeners.entries()) {
        if (evtName.includes('*')) {
          const regex = new RegExp('^' + evtName.replace(/\\*/g, '.*') + '$');
          if (regex.test(event)) {
            const copy = [...list];
            for (const entry of copy) {
              try {
                entry.handler(payload, event);
                if (entry.once) this.off(evtName, entry.handler);
              } catch (err) {
                console.error(\`EventBus wildcard error in "\${evtName}":\`, err);
              }
            }
          }
        }
      }
    }

    clear() {
      this.listeners.clear();
    }
  }

  return new EventBus();
}));
`;
fs.writeFileSync(path.join(coreDir, 'EventBus.js'), eventBusContent);
console.log('Created EventBus.js');

// 3. Router.js
const routerContent = `/**
 * ChatWave 3.0 - Single-Page Client Router
 * Manages hash-based routing, views switching, query parameters, guards, and transition animations.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveRouter = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class Router {
    constructor() {
      this.routes = new Map();
      this.currentRoute = null;
      this.params = {};
      this.guards = [];
      this.init();
    }

    init() {
      window.addEventListener('hashchange', () => this.handleHashChange());
      window.addEventListener('load', () => this.handleHashChange());
    }

    register(path, handler) {
      this.routes.set(path, handler);
      return this;
    }

    addGuard(guardFn) {
      this.guards.push(guardFn);
      return this;
    }

    navigate(path, params = {}) {
      let hash = '#' + path;
      const queryKeys = Object.keys(params);
      if (queryKeys.length > 0) {
        const qs = queryKeys.map(k => \`\${encodeURIComponent(k)}=\${encodeURIComponent(params[k])}\`).join('&');
        hash += '?' + qs;
      }
      window.location.hash = hash;
    }

    handleHashChange() {
      const fullHash = window.location.hash.slice(1) || '/';
      const [pathPart, queryPart] = fullHash.split('?');
      const queryParams = {};
      if (queryPart) {
        queryPart.split('&').forEach(part => {
          const [k, v] = part.split('=');
          if (k) queryParams[decodeURIComponent(k)] = decodeURIComponent(v || '');
        });
      }

      // Check guards
      for (const guard of this.guards) {
        const allowed = guard(pathPart, queryParams);
        if (!allowed) return;
      }

      this.currentRoute = pathPart;
      this.params = queryParams;

      // Find matching route
      let matched = false;
      for (const [routePattern, handler] of this.routes.entries()) {
        if (this.matchRoute(routePattern, pathPart, queryParams)) {
          handler(queryParams, pathPart);
          matched = true;
          break;
        }
      }

      if (!matched && this.routes.has('*')) {
        this.routes.get('*')(queryParams, pathPart);
      }
    }

    matchRoute(pattern, currentPath, queryParams) {
      if (pattern === currentPath) return true;
      if (pattern.includes(':')) {
        const patternParts = pattern.split('/');
        const currentParts = currentPath.split('/');
        if (patternParts.length !== currentParts.length) return false;
        for (let i = 0; i < patternParts.length; i++) {
          if (patternParts[i].startsWith(':')) {
            const paramName = patternParts[i].slice(1);
            queryParams[paramName] = currentParts[i];
          } else if (patternParts[i] !== currentParts[i]) {
            return false;
          }
        }
        return true;
      }
      return false;
    }
  }

  return new Router();
}));
`;
fs.writeFileSync(path.join(coreDir, 'Router.js'), routerContent);
console.log('Created Router.js');
