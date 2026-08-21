/**
 * ChatWave 3.0 - In-Chat Live Code Runner & Playground
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveCodePlayground = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  class CodePlayground {
    constructor() {
      this.htmlCode = '<h1 style="color:#00a884">Hello from ChatWave! ??</h1>\n<p>Interactive live code runner sandbox.</p>';
      this.jsCode = 'console.log("ChatWave code execution active!");';
      this.logs = [];
    }

    run(containerId = 'cw-code-preview') {
      const iframe = document.getElementById(containerId);
      if (!iframe) return;

      const fullSource = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>body { font-family: sans-serif; color: #fff; background: #111b21; padding: 12px; }</style>
        </head>
        <body>
          ${this.htmlCode}
          <script>
            try {
              ${this.jsCode}
            } catch(e) {
              console.error(e);
            }
          </script>
        </body>
        </html>
      `;

      iframe.srcdoc = fullSource;
    }
  }

  return new CodePlayground();
}));
