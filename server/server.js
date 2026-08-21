const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const config = require('./config/config');
const db = require('./db/memoryStore');

let express, socketIo, cors;
try {
  express = require('express');
  socketIo = require('socket.io');
  cors = require('cors');
} catch (e) {
  // Optional dependencies not installed; fallback to standard http server
}

let server;

if (express && socketIo) {
  const app = express();
  server = http.createServer(app);
  const io = socketIo(server, { cors: { origin: '*' } });

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.static(path.join(__dirname, '../')));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'online', version: '3.0.0', timestamp: new Date().toISOString() });
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
} else {
  // Pure Node.js Built-in Zero-Dependency HTTP Server
  server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'online',
        version: '3.0.0',
        engine: 'native-node-http',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }));
      return;
    }

    // Static File Serving
    let filePath = path.join(__dirname, '..', pathname === '/' ? 'index.html' : pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(__dirname, '../index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (err) {
      res.writeHead(500);
      res.end('Server Error: ' + err.message);
    }
  });
}

if (require.main === module) {
  server.listen(config.PORT, () => {
    console.log(`🚀 ChatWave 3.0 Server listening on port ${config.PORT}`);
  });
}

module.exports = { server };
