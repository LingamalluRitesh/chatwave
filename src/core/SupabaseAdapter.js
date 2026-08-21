/**
 * ChatWave 3.0 - Supabase Realtime & Database Adapter
 * Manages live connection, offline message queues, presence tracking, broadcast events, and retry policies.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSupabase = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const DEFAULT_URL = 'https://dxraqfnywfivgohyrwey.supabase.co';
  const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cmFxZm55d2ZpdmdvaHlyd2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MjI0MjAsImV4cCI6MjEwMTA5ODQyMH0.9DRWDYhJW625yGzcupMGN4mBi1msuJJ2dz5m8R5Ju-o';

  class SupabaseAdapter {
    constructor() {
      this.client = null;
      this.channel = null;
      this.isConnected = false;
      this.offlineQueue = [];
      this.presenceKey = null;
      this.onlineUsers = new Set();
      this.retryCount = 0;
      this.maxRetries = 5;
    }

    init(url = DEFAULT_URL, key = DEFAULT_KEY) {
      if (typeof window !== 'undefined' && window.supabase) {
        this.client = window.supabase.createClient(url, key, {
          auth: { persistSession: false },
          realtime: {
            params: { eventsPerSecond: 20 }
          }
        });
        return this.client;
      } else {
        console.warn('Supabase SDK not loaded globally.');
        return null;
      }
    }

    getClient() {
      if (!this.client) this.init();
      return this.client;
    }

    setupRealtime(currentUser, onMessage, onPresenceUpdate, onTyping) {
      if (!this.client || !currentUser) return;
      if (this.channel) {
        this.client.removeChannel(this.channel);
        this.channel = null;
      }

      this.presenceKey = currentUser.id;
      this.channel = this.client.channel('chatwave_global_realtime', {
        config: { presence: { key: currentUser.id } }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cw_messages' }, (payload) => {
        if (typeof onMessage === 'function') onMessage(payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cw_groups' }, (payload) => {
        if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('groups:changed', payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cw_group_members' }, (payload) => {
        if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('group_members:changed', payload);
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (typeof onTyping === 'function') onTyping(payload);
      })
      .on('broadcast', { event: 'webrtc_signal' }, ({ payload }) => {
        if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('webrtc:signal', payload);
      })
      .on('broadcast', { event: 'whiteboard_draw' }, ({ payload }) => {
        if (root.ChatWaveEventBus) root.ChatWaveEventBus.emit('whiteboard:remote_draw', payload);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel.presenceState();
        this.onlineUsers.clear();
        Object.keys(state).forEach(k => this.onlineUsers.add(k));
        if (typeof onPresenceUpdate === 'function') onPresenceUpdate(Array.from(this.onlineUsers));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          await this.channel.track({
            user_id: currentUser.id,
            name: currentUser.name,
            online_at: new Date().toISOString()
          });
          this.flushOfflineQueue();
        } else {
          this.isConnected = false;
        }
      });
    }

    broadcastTyping(payload) {
      if (this.channel && this.isConnected) {
        this.channel.send({
          type: 'broadcast',
          event: 'typing',
          payload
        });
      }
    }

    broadcastWebRTCSignal(signal) {
      if (this.channel && this.isConnected) {
        this.channel.send({
          type: 'broadcast',
          event: 'webrtc_signal',
          payload: signal
        });
      }
    }

    broadcastWhiteboard(drawAction) {
      if (this.channel && this.isConnected) {
        this.channel.send({
          type: 'broadcast',
          event: 'whiteboard_draw',
          payload: drawAction
        });
      }
    }

    async sendMessage(msgObj) {
      const client = this.getClient();
      if (!client) throw new Error('Supabase client uninitialized');

      try {
        const { data, error } = await client.from('cw_messages').insert(msgObj).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Message send failed, queueing offline:', err);
        this.offlineQueue.push(msgObj);
        throw err;
      }
    }

    async flushOfflineQueue() {
      if (!this.offlineQueue.length) return;
      const client = this.getClient();
      if (!client) return;

      const queue = [...this.offlineQueue];
      this.offlineQueue = [];

      for (const msg of queue) {
        try {
          await client.from('cw_messages').insert(msg);
        } catch (e) {
          this.offlineQueue.push(msg);
        }
      }
    }

    isUserOnline(userId) {
      return this.onlineUsers.has(userId);
    }
  }

  return new SupabaseAdapter();
}));
