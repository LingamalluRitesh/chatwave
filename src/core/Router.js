/**
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
        const qs = queryKeys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
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
