const fs = require('fs');
const path = require('path');

const compDir = path.join(__dirname, '../src/components');

// 1. WhiteboardComponent.js
const whiteboardContent = `/**
 * ChatWave 3.0 - Collaborative Real-Time Whiteboard Canvas
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveWhiteboard = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class WhiteboardComponent {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.isDrawing = false;
      this.tool = 'brush'; // 'brush' | 'eraser' | 'line' | 'rect' | 'circle'
      this.color = '#00a884';
      this.size = 4;
      this.history = [];
      this.historyIndex = -1;
      this.startX = 0;
      this.startY = 0;
      this.snapshot = null;
    }

    init(canvasId = 'cw-whiteboard-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.bindEvents();
      this.saveState();
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.ctx.fillStyle = '#111b21';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    bindEvents() {
      if (!this.canvas) return;

      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      };

      const start = (e) => {
        e.preventDefault();
        this.isDrawing = true;
        const pos = getPos(e);
        this.startX = pos.x;
        this.startY = pos.y;
        this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
      };

      const move = (e) => {
        if (!this.isDrawing) return;
        e.preventDefault();
        const pos = getPos(e);

        if (this.tool === 'brush' || this.tool === 'eraser') {
          this.ctx.strokeStyle = this.tool === 'eraser' ? '#111b21' : this.color;
          this.ctx.lineWidth = this.size * (this.tool === 'eraser' ? 3 : 1);
          this.ctx.lineCap = 'round';
          this.ctx.lineJoin = 'round';
          this.ctx.lineTo(pos.x, pos.y);
          this.ctx.stroke();
        } else {
          this.ctx.putImageData(this.snapshot, 0, 0);
          this.ctx.strokeStyle = this.color;
          this.ctx.lineWidth = this.size;
          this.ctx.lineCap = 'round';
          
          if (this.tool === 'line') {
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
          } else if (this.tool === 'rect') {
            this.ctx.strokeRect(this.startX, this.startY, pos.x - this.startX, pos.y - this.startY);
          } else if (this.tool === 'circle') {
            const rad = Math.sqrt(Math.pow(pos.x - this.startX, 2) + Math.pow(pos.y - this.startY, 2));
            this.ctx.beginPath();
            this.ctx.arc(this.startX, this.startY, rad, 0, Math.PI * 2);
            this.ctx.stroke();
          }
        }
      };

      const end = (e) => {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.ctx.closePath();
        this.saveState();
      };

      this.canvas.addEventListener('mousedown', start);
      this.canvas.addEventListener('mousemove', move);
      this.canvas.addEventListener('mouseup', end);
      this.canvas.addEventListener('touchstart', start, { passive: false });
      this.canvas.addEventListener('touchmove', move, { passive: false });
      this.canvas.addEventListener('touchend', end);
    }

    saveState() {
      if (!this.ctx || !this.canvas) return;
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
      if (this.history.length > 20) this.history.shift();
      else this.historyIndex++;
    }

    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
      }
    }

    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.ctx.putImageData(this.history[this.historyIndex], 0, 0);
      }
    }

    clear() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.fillStyle = '#111b21';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.saveState();
    }

    setTool(tool) {
      this.tool = tool;
    }

    setColor(color) {
      this.color = color;
    }

    setSize(size) {
      this.size = parseInt(size, 10);
    }

    exportImage() {
      if (!this.canvas) return null;
      return this.canvas.toDataURL('image/png');
    }

    sendToChat() {
      const dataUrl = this.exportImage();
      if (dataUrl && root.ChatWaveApp) {
        root.ChatWaveApp.sendMessage({
          type: 'image',
          url: dataUrl,
          content: '?? Whiteboard sketch'
        });
        if (root.ChatWaveApp.toast) root.ChatWaveApp.toast('Drawing sent to chat! ??', 'success');
      }
    }
  }

  return new WhiteboardComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Whiteboard/WhiteboardComponent.js'), whiteboardContent);
console.log('Created WhiteboardComponent.js');

// 2. AIAssistantComponent.js
const aiAssistantContent = `/**
 * ChatWave 3.0 - ChatWave AI Companion & Smart Assistant
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveAI = factory();
}(typeof self !== 'undefined' ? self : this, function() {
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
        \`?? **ChatWave AI (\${this.currentPersona.name}) Response:**\\n\\nI analyzed your query: "\${userText}".\\n\\nHere is what I recommend:\\n1. High performance optimization\\n2. Clean modular structure\\n3. Reactive real-time sync\\n\\nLet me know if you need code snippets or deeper explanations!\`,
        \`? **Insights & Ideas:**\\n\\nGreat question! In modern messaging architectures, WebRTC mesh calling paired with Supabase Realtime guarantees ultra-low latency and privacy. Let's make this rock-solid!\`,
        \`?? **Summary:**\\n- Clear action items identified\\n- Real-time event broadcasting ready\\n- End-to-end cryptographic security active\`
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
        'Awesome, let\\'s do it! ??',
        'Can you share more details? ??'
      ];
    }
  }

  return new AIAssistantComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'AIAssistant/AIAssistantComponent.js'), aiAssistantContent);
console.log('Created AIAssistantComponent.js');

// 3. StoriesComponent.js
const storiesContent = `/**
 * ChatWave 3.0 - 24-Hour Stories & Status Updates System
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveStories = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class StoriesComponent {
    constructor() {
      this.stories = this.loadStories();
      this.activeStoryIndex = 0;
      this.activeItemIndex = 0;
      this.storyTimer = null;
    }

    loadStories() {
      return [
        {
          id: 's1',
          user: { id: 'u1', name: 'ChatWave Team', avatar: null, color: '#00a884' },
          items: [
            { id: 'i1', type: 'text', content: 'Welcome to ChatWave 3.0! ?? Ultra-fast cloud messaging is live.', bg: 'linear-gradient(135deg, #00a884, #005c4b)', ts: Date.now() - 3600000 },
            { id: 'i2', type: 'text', content: '?? Try the in-chat Mini-Apps & HD WebRTC calling today!', bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', ts: Date.now() - 1800000 }
          ]
        }
      ];
    }

    addStory(item) {
      const user = root.ChatWaveStateStore ? root.ChatWaveStateStore.get('currentUser') : { id: 'me', name: 'You' };
      let myStory = this.stories.find(s => s.user.id === user.id);
      if (!myStory) {
        myStory = { id: 's_' + Date.now(), user, items: [] };
        this.stories.unshift(myStory);
      }
      myStory.items.push(Object.assign({ id: 'i_' + Date.now(), ts: Date.now() }, item));
      this.renderRings();
    }

    renderRings(containerId = 'cw-stories-bar') {
      const container = document.getElementById(containerId);
      if (!container) return;

      let html = \`
        <div class="cw-story-ring my-story" onclick="ChatWaveStories.openCreator()">
          <div class="cw-story-avatar add-icon">+</div>
          <span>Your Status</span>
        </div>
      \`;

      this.stories.forEach((st, sIdx) => {
        html += \`
          <div class="cw-story-ring" onclick="ChatWaveStories.viewStory(\${sIdx})">
            <div class="cw-story-avatar" style="background:\${st.user.color || '#3b82f6'}">
              <span>\${st.user.name.charAt(0)}</span>
            </div>
            <span>\${st.user.name.split(' ')[0]}</span>
          </div>
        \`;
      });

      container.innerHTML = html;
    }

    viewStory(sIdx) {
      this.activeStoryIndex = sIdx;
      this.activeItemIndex = 0;
      this.showViewerModal();
    }

    showViewerModal() {
      let modal = document.getElementById('cw-story-viewer-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cw-story-viewer-modal';
        modal.className = 'cw-story-modal';
        document.body.appendChild(modal);
      }

      const st = this.stories[this.activeStoryIndex];
      const item = st.items[this.activeItemIndex];

      modal.innerHTML = \`
        <div class="cw-story-viewer" style="background:\${item.bg || '#111b21'}">
          <div class="cw-story-progress-bars">
            \${st.items.map((it, idx) => \`<div class="cw-story-bar \${idx === this.activeItemIndex ? 'active' : (idx < this.activeItemIndex ? 'done' : '')}"></div>\`).join('')}
          </div>
          <div class="cw-story-top">
            <b>\${st.user.name}</b>
            <button onclick="ChatWaveStories.closeViewer()">?</button>
          </div>
          <div class="cw-story-body">
            \${item.type === 'image' ? \`<img src="\${item.url}" />\` : \`<div class="cw-story-text">\${item.content}</div>\`}
          </div>
          <div class="cw-story-controls">
            <button onclick="ChatWaveStories.prevItem()">?</button>
            <button onclick="ChatWaveStories.nextItem()">?</button>
          </div>
        </div>
      \`;

      modal.classList.remove('hidden');
      clearTimeout(this.storyTimer);
      this.storyTimer = setTimeout(() => this.nextItem(), 5000);
    }

    nextItem() {
      const st = this.stories[this.activeStoryIndex];
      if (this.activeItemIndex < st.items.length - 1) {
        this.activeItemIndex++;
        this.showViewerModal();
      } else if (this.activeStoryIndex < this.stories.length - 1) {
        this.activeStoryIndex++;
        this.activeItemIndex = 0;
        this.showViewerModal();
      } else {
        this.closeViewer();
      }
    }

    prevItem() {
      if (this.activeItemIndex > 0) {
        this.activeItemIndex--;
        this.showViewerModal();
      } else if (this.activeStoryIndex > 0) {
        this.activeStoryIndex--;
        this.activeItemIndex = 0;
        this.showViewerModal();
      }
    }

    closeViewer() {
      clearTimeout(this.storyTimer);
      const modal = document.getElementById('cw-story-viewer-modal');
      if (modal) modal.classList.add('hidden');
    }

    openCreator() {
      const text = prompt('Enter text for your status:');
      if (text && text.trim()) {
        const colors = [
          'linear-gradient(135deg, #00a884, #005c4b)',
          'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          'linear-gradient(135deg, #f59e0b, #b45309)',
          'linear-gradient(135deg, #ec4899, #be185d)',
          'linear-gradient(135deg, #8b5cf6, #6d28d9)'
        ];
        this.addStory({
          type: 'text',
          content: text.trim(),
          bg: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }
  }

  return new StoriesComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Stories/StoriesComponent.js'), storiesContent);
console.log('Created StoriesComponent.js');

// 4. PollComponent.js
const pollContent = `/**
 * ChatWave 3.0 - In-Chat Live Polls & Quiz Generator
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWavePolls = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class PollComponent {
    constructor() {}

    createPoll(question, options, isMultiple = false) {
      return {
        id: 'poll_' + Date.now(),
        question: question.trim(),
        options: options.map((opt, idx) => ({ id: idx, text: opt.trim(), votes: [] })),
        isMultiple,
        totalVotes: 0,
        createdAt: Date.now()
      };
    }

    vote(poll, optionId, userId) {
      if (!poll || !userId) return poll;
      
      poll.options.forEach(opt => {
        if (opt.id === optionId) {
          if (!opt.votes.includes(userId)) opt.votes.push(userId);
          else opt.votes = opt.votes.filter(u => u !== userId);
        } else if (!poll.isMultiple) {
          opt.votes = opt.votes.filter(u => u !== userId);
        }
      });

      let total = 0;
      poll.options.forEach(opt => total += opt.votes.length);
      poll.totalVotes = total;

      if (root.ChatWaveSound) root.ChatWaveSound.playButtonClick();
      return poll;
    }

    renderPollHTML(poll, currentUserId) {
      if (!poll) return '';
      const total = Math.max(1, poll.totalVotes);

      let optionsHtml = '';
      poll.options.forEach(opt => {
        const pct = Math.round((opt.votes.length / total) * 100);
        const hasVoted = opt.votes.includes(currentUserId);

        optionsHtml += \`
          <div class="cw-poll-opt \${hasVoted ? 'voted' : ''}" onclick="ChatWaveApp.handlePollVote('\${poll.id}', \${opt.id})">
            <div class="cw-poll-bar" style="width:\${poll.totalVotes > 0 ? pct : 0}%"></div>
            <div class="cw-poll-opt-content">
              <span>\${hasVoted ? '? ' : ''}\${opt.text}</span>
              <b>\${poll.totalVotes > 0 ? pct + '%' : ''}</b>
            </div>
          </div>
        \`;
      });

      return \`
        <div class="cw-poll-card" id="poll_\${poll.id}">
          <div class="cw-poll-title">?? \${poll.question}</div>
          <div class="cw-poll-options">\${optionsHtml}</div>
          <div class="cw-poll-footer">\${poll.totalVotes} \${poll.totalVotes === 1 ? 'vote' : 'votes'} · Live Poll</div>
        </div>
      \`;
    }
  }

  return new PollComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Polls/PollComponent.js'), pollContent);
console.log('Created PollComponent.js');
