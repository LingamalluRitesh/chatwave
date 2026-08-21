const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, '../server');
const routesDir = path.join(serverDir, 'routes');
const controllersDir = path.join(serverDir, 'controllers');
const servicesDir = path.join(serverDir, 'services');
const middlewareDir = path.join(serverDir, 'middleware');
const dbDir = path.join(serverDir, 'db');
const configDir = path.join(serverDir, 'config');

[serverDir, routesDir, controllersDir, servicesDir, middlewareDir, dbDir, configDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. config/config.js
const configContent = `/**
 * ChatWave 3.0 - Server Configuration
 */
module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'chatwave_super_secret_jwt_key_2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX: 500,
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://dxraqfnywfivgohyrwey.supabase.co',
  SUPABASE_KEY: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cmFxZm55d2ZpdmdvaHlyd2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MjI0MjAsImV4cCI6MjEwMTA5ODQyMH0.9DRWDYhJW625yGzcupMGN4mBi1msuJJ2dz5m8R5Ju-o'
};
`;
fs.writeFileSync(path.join(configDir, 'config.js'), configContent);

// 2. db/memoryStore.js
const memoryStoreContent = `/**
 * ChatWave 3.0 - High-Speed In-Memory Database & Cache Store
 */
class MemoryStore {
  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.groups = new Map();
    this.channels = new Map();
    this.sessions = new Map();
    this.calls = new Map();
    this.initDefaultSeed();
  }

  initDefaultSeed() {
    const defaultUsers = [
      { id: 'u_1', username: 'admin', name: 'ChatWave Team', email: 'admin@chatwave.app', avatar_url: null, color: '#00a884', about: 'Official ChatWave System Operator' }
    ];
    defaultUsers.forEach(u => this.users.set(u.id, u));
  }

  getUserById(id) { return this.users.get(id); }
  getUserByUsername(uname) {
    for (const u of this.users.values()) {
      if (u.username.toLowerCase() === uname.toLowerCase()) return u;
    }
    return null;
  }
  saveUser(user) { this.users.set(user.id, user); return user; }

  saveMessage(msg) {
    if (!msg.id) msg.id = 'm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    msg.created_at = msg.created_at || new Date().toISOString();
    this.messages.set(msg.id, msg);
    return msg;
  }

  getMessagesBetween(userA, userB, limit = 100) {
    const msgs = [];
    for (const m of this.messages.values()) {
      if ((m.from_id === userA && m.to_id === userB) || (m.from_id === userB && m.to_id === userA)) {
        msgs.push(m);
      }
    }
    msgs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return msgs.slice(-limit);
  }

  getGroupMessages(groupId, limit = 100) {
    const msgs = [];
    for (const m of this.messages.values()) {
      if (m.group_id === groupId) msgs.push(m);
    }
    msgs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return msgs.slice(-limit);
  }
}

module.exports = new MemoryStore();
`;
fs.writeFileSync(path.join(dbDir, 'memoryStore.js'), memoryStoreContent);

// 3. server.js
const serverJsContent = `/**
 * ChatWave 3.0 - Enterprise Node.js Express + Socket.IO Backend Server
 */
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const socketIo = require('socket.io');
const config = require('./config/config');
const db = require('./db/memoryStore');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth Routes Mock
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const user = db.getUserByUsername(username) || { id: 'u_' + Date.now(), username, name: username, color: '#00a884' };
  res.json({ user, token: 'cw_token_' + user.id });
});

// Messages Route Mock
app.get('/api/messages', (req, res) => {
  const { from, to, group } = req.query;
  if (group) {
    return res.json({ messages: db.getGroupMessages(group) });
  } else if (from && to) {
    return res.json({ messages: db.getMessagesBetween(from, to) });
  }
  res.json({ messages: [] });
});

app.post('/api/messages', (req, res) => {
  const msg = db.saveMessage(req.body);
  io.emit('message:new', msg);
  res.json({ message: msg });
});

// WebRTC Signaling & Socket.IO Events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user_joined', { socketId: socket.id });
  });

  socket.on('webrtc_signal', (payload) => {
    if (payload.targetSocketId) {
      io.to(payload.targetSocketId).emit('webrtc_signal', payload);
    } else if (payload.roomId) {
      socket.to(payload.roomId).emit('webrtc_signal', payload);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

if (require.main === module) {
  server.listen(config.PORT, () => {
    console.log(\`?? ChatWave 3.0 Server running on port \${config.PORT}\`);
  });
}

module.exports = { app, server, io };
`;
fs.writeFileSync(path.join(serverDir, 'server.js'), serverJsContent);
console.log('Created server.js and backend modules');
