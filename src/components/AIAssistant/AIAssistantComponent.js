/**
 * ChatWave 3.0 - ChatWave AI Companion & Smart Assistant
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveAI = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  const PERSONAS = [
    { id: 'dev', name: 'Code Expert ??', prompt: 'You are an elite software architect and coding companion.' },
    { id: 'friend', name: 'Friendly Buddy ?', prompt: 'You are a warm, casual, and witty friend.' },
    { id: 'writer', name: 'Creative Writer ?', prompt: 'You are an inspiring poet, storyteller, and copywriter.' },
    { id: 'tutor', name: 'Language Tutor ??', prompt: 'You are a patient multilingual teacher.' }
  ];

  class AIAssistantComponent {
    constructor() {
      this.currentPersona = PERSONAS[0];
      this.messages = [];
      this.isThinking = false;
    }

    setPersona(id) {
      this.currentPersona = PERSONAS.find(p => p.id === id) || PERSONAS[0];
    }

    async prompt(userText, onChunk, onComplete) {
      this.messages.push({ role: 'user', content: userText, timestamp: Date.now() });
      this.isThinking = true;

      // Simulated streaming AI response generator
      const mockResponses = [
        `?? **ChatWave AI (${this.currentPersona.name}) Response:**\n\nI analyzed your query: "${userText}".\n\nHere is what I recommend:\n1. High performance optimization\n2. Clean modular structure\n3. Reactive real-time sync\n\nLet me know if you need code snippets or deeper explanations!`,
        `? **Insights & Ideas:**\n\nGreat question! In modern messaging architectures, WebRTC mesh calling paired with Supabase Realtime guarantees ultra-low latency and privacy. Let's make this rock-solid!`,
        `?? **Summary:**\n- Clear action items identified\n- Real-time event broadcasting ready\n- End-to-end cryptographic security active`
      ];

      const chosen = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      let streamed = '';
      const words = chosen.split(' ');

      for (let i = 0; i < words.length; i++) {
        streamed += (i > 0 ? ' ' : '') + words[i];
        if (typeof onChunk === 'function') onChunk(streamed);
        await new Promise(r => setTimeout(r, 40));
      }

      this.isThinking = false;
      this.messages.push({ role: 'assistant', content: chosen, timestamp: Date.now() });
      if (typeof onComplete === 'function') onComplete(chosen);
      return chosen;
    }

    generateSmartReplies(lastMessageText) {
      return [
        'Sounds great! ??',
        'Let me check that out ??',
        'Awesome, let\'s do it! ??',
        'Can you share more details? ??'
      ];
    }
  }

  return new AIAssistantComponent();
}));
