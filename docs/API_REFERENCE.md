# ChatWave 3.0 API Reference & Protocol Specification

## 1. REST API Endpoints

### `GET /api/health`
Returns system operational status, version, and server uptime.

**Response:**
```json
{
  "status": "online",
  "version": "3.0.0",
  "timestamp": "2026-08-21T16:50:00.000Z",
  "uptime": 1248.5
}
```

### `POST /api/auth/login`
Authenticates user credentials and returns session token.

**Request Body:**
```json
{
  "username": "alice",
  "password": "password123"
}
```

### `GET /api/messages`
Query message history for direct or group chats.

**Query Parameters:**
- `from`: User ID of sender
- `to`: User ID of recipient
- `group`: Group ID

---

## 2. WebSocket & Socket.IO Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `join_room` | Client -> Server | `roomId` | Joins communication room for signaling |
| `webrtc_signal` | Bidirectional | `{ targetSocketId, type, sdp, candidate }` | Transports WebRTC SDP offers/answers & ICE candidates |
| `message:new` | Server -> Client | `MessageObject` | Broadcasts incoming messages in real-time |
| `typing` | Bidirectional | `{ from_id, name, group_id }` | Emits typing indicator state |
