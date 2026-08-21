/**
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
            console.error(`EventBus error in "${event}":`, err);
          }
        }
      }

      // Wildcard listeners (e.g. 'chat:*')
      for (const [evtName, list] of this.listeners.entries()) {
        if (evtName.includes('*')) {
          const regex = new RegExp('^' + evtName.replace(/\*/g, '.*') + '$');
          if (regex.test(event)) {
            const copy = [...list];
            for (const entry of copy) {
              try {
                entry.handler(payload, event);
                if (entry.once) this.off(evtName, entry.handler);
              } catch (err) {
                console.error(`EventBus wildcard error in "${evtName}":`, err);
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
