/**
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
