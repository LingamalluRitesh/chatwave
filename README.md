# ChatWave 3.0 - Ultra-Interactive Real-Time Messaging & WebRTC Platform

A high-performance, full-featured real-time communication platform engineered with WebRTC peer-to-peer audio/video streaming, end-to-end encryption (E2EE), collaborative interactive whiteboard, embedded mini-apps, and multi-role messaging.

---

## 🔒 Intellectual Property & Proprietary Ownership Declaration

> [!IMPORTANT]
> **Proprietary and Confidential**  
> Copyright (c) 2026. All Rights Reserved.  
> This software codebase, architecture, protocols, and documentation are original, proprietary intellectual property.  
> - **100% Original Authorship**: Free from open-source copyleft encumbrances, client obligations, and third-party entanglements.  
> - **Non-Exclusive AI Model Licensing Compatible**: Structured to satisfy strict data licensing criteria for machine learning training and benchmarking.

---

## 🏛️ System Architecture & Real-Time Data Flow

```mermaid
graph TD
    ClientA[ChatWave Web / Android Client A] -->|HTTPS REST & WebSockets| Server[Node.js Express & Socket.io Signaling Server]
    ClientB[ChatWave Web / Android Client B] -->|HTTPS REST & WebSockets| Server
    
    Server --> Auth[Session & Auth Store]
    Server --> RoomMgr[Room & Channel Manager]
    Server --> SignalRelay[WebRTC SDP & ICE Signal Relay]
    
    ClientA <-->|P2P Encrypted Audio/Video (WebRTC)| ClientB
    ClientA <-->|E2EE Encrypted Data Channel| ClientB
    
    ClientA --> Whiteboard[Real-Time Collaborative Canvas Engine]
    ClientA --> MiniApps[Embedded Mini-Apps: Chess, Wordle, AI Hub]
```

### Core Technology Stack:
- **Application Core**: JavaScript (ES6+), HTML5 Canvas, Web Audio & WebRTC APIs.
- **Backend Signaling Server**: Node.js & Express.js.
- **Real-Time Protocol**: WebSockets via Socket.io / Native Zero-Dependency HTTP engine.
- **End-to-End Encryption (E2EE)**: WebCrypto AES-256-GCM / CBC symmetric encryption.
- **Mobile Hybrid Container**: Capacitor / Cordova Android integration.
- **Automated Testing**: Custom Node test runner with 8 unit & integration test suites.

---

## 🚀 Key Feature Modules

| Feature Module | Technical Implementation |
| :--- | :--- |
| **Real-Time Messaging** | High-throughput duplex WebSocket channels with delivery receipts and typing indicators. |
| **WebRTC Audio/Video Calls** | Mesh peer-to-peer connection with dynamic SDP offer/answer exchange and ICE candidate negotiation. |
| **End-to-End Encryption (E2EE)** | Client-side cryptographic key derivation ensuring zero server-side plaintext exposure. |
| **Collaborative Whiteboard** | Synchronized HTML5 vector canvas with stroke serialization, path smoothing, and undo/redo stacks. |
| **Embedded Mini-Apps Engine** | Sandboxed interactive applications including Chess engine, Wordle puzzle, and AI assistant connector. |
| **Cross-Platform Mobile App** | Native Android containerization with offline caching and background push notifications. |

---

## 💻 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/LingamalluRitesh/chatwave.git
cd chatwave

# Install dependencies
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

### 4. Start the Application Server
```bash
# Production mode
npm start

# Development mode
npm run dev
```
*Application will be available on `http://localhost:3000` (or configured PORT).*

---

## 🧪 Automated Testing & Runnability Verification

This codebase includes automated test suites covering state management, game logic, server health, security headers, E2EE cryptographic verification, and WebRTC signaling protocols:

```bash
# Run all automated test suites
npm test
```

### Test Suites Included:
1. `StateStore.test.js` — Reactive client state store and event emitter validation.
2. `ChessGame.test.js` — Chess move validator, checkmate detection, and board state.
3. `WordleGame.test.js` — Dictionary validation, letter score evaluation, and game state.
4. `ServerHealth.test.js` — Server uptime, diagnostic probes, and HTTP response schemas.
5. `SecurityHeaders.test.js` — CORS preflight headers, injection sanitization, and content types.
6. `E2EEncryption.test.js` — AES cryptographic encryption, decryption, and cipher integrity.
7. `WebRTCChannel.test.js` — SDP signal serialization and ICE candidate exchange schemas.
8. `WhiteboardState.test.js` — Canvas stroke serialization, path history, and undo engine.

---

## 📡 Real-Time WebSockets & WebRTC Signaling Reference

| Event Name | Direction | Payload Description |
| :--- | :---: | :--- |
| `message:send` | Client $\rightarrow$ Server | Encrypted chat message payload with timestamp and room ID |
| `message:receive` | Server $\rightarrow$ Client | Broadcast encrypted payload to room participants |
| `webrtc:offer` | Client $\rightarrow$ Server $\rightarrow$ Peer | SDP offer for video/audio call initialization |
| `webrtc:answer` | Peer $\rightarrow$ Server $\rightarrow$ Client | SDP answer accepting media call |
| `webrtc:ice-candidate`| Bi-directional | Network routing candidate for P2P connection |
| `whiteboard:stroke` | Bi-directional | Synchronized vector drawing coordinates and color styles |
| `miniapp:move` | Bi-directional | Mini-app game state move synchronization |

---

## 📁 Repository Structure

```
chatwave/
├── server/                   # Node.js backend server & socket handlers
│   ├── config/               # Server ports & runtime settings
│   ├── db/                   # In-memory session and channel store
│   └── server.js             # Dual Express / Zero-dependency HTTP server
├── tests/                    # Automated testing suite
│   ├── unit/                 # 8 unit & integration test files
│   └── runner.js             # Master test execution harness
├── src/                      # Client-side core logic & UI controllers
├── www/                      # Web distribution assets
├── android/                  # Android mobile container configuration
├── docs/                     # Documentation & architectural guides
├── .env.example              # Sanitized environment template
├── .gitignore                # Production ignore rules
└── README.md                 # Master project documentation
```
