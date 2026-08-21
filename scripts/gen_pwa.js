const fs = require('fs');
const path = require('path');

// package.json
const pkg = {
  name: "chatwave-messaging-app",
  version: "3.0.0",
  description: "ChatWave 3.0 - Ultra-Interactive Real-Time Messaging Platform with WebRTC Calls, Mini-Apps, AI Assistant, Whiteboard & E2EE",
  main: "server/server.js",
  scripts: {
    "start": "node server/server.js",
    "dev": "node server/server.js",
    "test": "node tests/runner.js"
  },
  dependencies: {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "socket.io": "^4.7.5"
  },
  keywords: ["messaging", "chatwave", "webrtc", "miniapps", "ai", "whiteboard", "e2ee", "realtime", "supabase"],
  author: "Lingamallu Ritesh & Antigravity",
  license: "MIT"
};
fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(pkg, null, 2));

// manifest.json
const manifest = {
  name: "ChatWave 3.0",
  short_name: "ChatWave",
  start_url: "/",
  display: "standalone",
  background_color: "#111b21",
  theme_color: "#00a884",
  description: "Private & Secure Cloud Messaging with Voice/Video Calls, Mini-Apps & Whiteboard",
  icons: [
    {
      src: "https://cdn-icons-png.flaticon.com/512/1384/1384055.png",
      sizes: "512x512",
      type: "image/png"
    }
  ]
};
fs.writeFileSync(path.join(__dirname, '../manifest.json'), JSON.stringify(manifest, null, 2));

// sw.js
const swContent = `// ChatWave 3.0 Service Worker with Offline Caching & Background Sync
const CACHE_NAME = 'chatwave-v3-cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});
`;
fs.writeFileSync(path.join(__dirname, '../sw.js'), swContent);

console.log('Updated package.json, manifest.json, sw.js');
