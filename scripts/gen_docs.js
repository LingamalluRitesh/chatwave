const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '../docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

// 1. ARCHITECTURE.md
const archContent = `# ChatWave 3.0 Enterprise Architecture & Technical Specification

ChatWave 3.0 is a real-time, highly interactive, production-grade communication and collaboration platform designed for instant messaging, HD WebRTC calling, collaborative whiteboards, in-chat mini-apps, and zero-knowledge cryptographic privacy.

---

## 1. High-Level Architecture

\`\`\`mermaid
graph TD
    Client[ChatWave 3.0 Web/Mobile Client]
    
    subgraph Frontend Core
        Store[Reactive State Store]
        Router[SPA Client Router]
        WebRTC[WebRTC Voice/Video Mesh]
        Crypto[E2E Cryptography Engine]
        IndexedDB[Offline IndexedDB Database]
        Audio[Web Audio Synthesizer]
        Particles[Canvas Particle Engine]
    end
    
    subgraph Real-Time & Backend
        Supabase[(Supabase Postgres & Realtime)]
        SocketServer[Node.js Express + Socket.IO Server]
    end
    
    Client --> Store
    Client --> WebRTC
    Client --> Crypto
    Client --> IndexedDB
    Client --> Audio
    Client --> Particles
    
    Store --> Supabase
    WebRTC --> SocketServer
    WebRTC --> Supabase
\`\`\`

---

## 2. Core Modules Breakdown

### 2.1 State Management (\`src/core/StateStore.js\`)
- **Pattern**: Central reactive event-driven state store with time-travel snapshots (undo/redo) and local storage persistence middleware.
- **Key Stores**: \`currentUser\`, \`activeChatId\`, \`messages\`, \`users\`, \`groups\`, \`channels\`, \`stories\`, \`callState\`, \`whiteboardState\`, \`activeMiniApp\`, \`vaultStats\`.

### 2.2 End-to-End Cryptography (\`src/core/CryptoEngine.js\`)
- **Key Exchange**: Elliptic Curve Diffie-Hellman (ECDH) over Curve P-256 using standard Web Cryptography API.
- **Symmetric Cipher**: AES-GCM 256-bit with 96-bit random initialization vectors (IVs) per message.
- **Key Derivation**: PBKDF2 with SHA-256, 100,000 iterations for password-derived vault credentials.

### 2.3 WebRTC Voice & Video Engine (\`src/core/WebRTCManager.js\`)
- **Mesh Topology**: 1-on-1 and multi-party peer connections with automatic STUN server failover.
- **Audio Processing**: Real-time Web Audio API FFT frequency analyzer for active speaker detection, noise suppression, and gain normalization.
- **Display Media**: Real-time screen sharing with dynamic track replacement without renegotiation dropouts.

### 2.4 Procedural Audio Synthesizer (\`src/core/SoundSynthesizer.js\`)
- Uses HTML5 Web Audio API oscillator nodes (sine, triangle, sawtooth) and gain envelopes to generate rich UI feedback sounds (chimes, pops, laser zaps, victory melodies, ringtones) with zero external audio assets.

### 2.5 In-Chat Mini-Apps & Games (\`src/components/MiniApps/\`)
- **Chess**: Complete engine with checkmate/stalemate detection and move history.
- **Tic-Tac-Toe**: Turn-based grid with win streak tracking and celebration confetti.
- **Wordle**: 5-letter word puzzle with green/yellow letter state tracking.
- **2048**: Matrix sliding tile game with smooth swipe controls and high scores.
- **Trivia Quiz**: Multi-category timer battle with score multiplier.
- **Code Playground**: In-browser live preview sandbox with console logger.
`;
fs.writeFileSync(path.join(docsDir, 'ARCHITECTURE.md'), archContent);

// 2. API_REFERENCE.md
const apiRefContent = `# ChatWave 3.0 API Reference & Protocol Specification

## 1. REST API Endpoints

### \`GET /api/health\`
Returns system operational status, version, and server uptime.

**Response:**
\`\`\`json
{
  "status": "online",
  "version": "3.0.0",
  "timestamp": "2026-08-21T16:50:00.000Z",
  "uptime": 1248.5
}
\`\`\`

### \`POST /api/auth/login\`
Authenticates user credentials and returns session token.

**Request Body:**
\`\`\`json
{
  "username": "alice",
  "password": "password123"
}
\`\`\`

### \`GET /api/messages\`
Query message history for direct or group chats.

**Query Parameters:**
- \`from\`: User ID of sender
- \`to\`: User ID of recipient
- \`group\`: Group ID

---

## 2. WebSocket & Socket.IO Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| \`join_room\` | Client -> Server | \`roomId\` | Joins communication room for signaling |
| \`webrtc_signal\` | Bidirectional | \`{ targetSocketId, type, sdp, candidate }\` | Transports WebRTC SDP offers/answers & ICE candidates |
| \`message:new\` | Server -> Client | \`MessageObject\` | Broadcasts incoming messages in real-time |
| \`typing\` | Bidirectional | \`{ from_id, name, group_id }\` | Emits typing indicator state |
`;
fs.writeFileSync(path.join(docsDir, 'API_REFERENCE.md'), apiRefContent);

// 3. USER_GUIDE.md
const userGuideContent = `# ChatWave 3.0 User Guide & Power Shortcuts

Welcome to **ChatWave 3.0** — your hyper-interactive, private cloud messaging platform.

## ?? Key Features

### 1. Messaging & Rich Media
- **Instant Messaging**: Real-time cloud sync powered by Supabase.
- **Voice Notes**: Tap ??? to record voice messages with live visualizer.
- **Attachments**: Share images, videos, audio, PDFs, and code files.
- **Reactions**: Double-tap any message to quick-react with ?? or right-click / long-press for full menu.

### 2. Mini-Apps & Games
- Tap the **Mini-Apps (??)** tab to play in-chat Chess, Tic-Tac-Toe, Wordle, 2048, or Trivia Quizzes with friends.

### 3. Collaborative Whiteboard
- Tap **Whiteboard (??)** to open a shared drawing canvas with brushes, geometric shapes, and instant "Send to Chat".

### 4. HD Voice & Video Calling
- Tap ?? in any chat header to start high-definition audio/video calls with screen sharing.

### 5. Theme Studio & Soundboard
- Customize your UI with 12+ vibrant themes or trigger synthesized meme audio effects on the Soundboard.

---

## ?? Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| \`Enter\` | Send Message |
| \`Shift + Enter\` | New Line in Input |
| \`Ctrl + /\` | Open Slash Commands (\`/ai\`, \`/poll\`, \`/game\`, \`/draw\`) |
| \`Esc\` | Close Context Menus / Modals |
`;
fs.writeFileSync(path.join(docsDir, 'USER_GUIDE.md'), userGuideContent);

console.log('Created comprehensive documentation files');
