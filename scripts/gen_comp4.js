const fs = require('fs');
const path = require('path');

const compDir = path.join(__dirname, '../src/components');

// 13. SidebarComponent.js
const sidebarContent = `/**
 * ChatWave 3.0 - Sidebar Component with search, filter pills, pinned chats, and presence
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSidebar = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class SidebarComponent {
    constructor() {
      this.filter = 'all';
      this.search = '';
    }

    setFilter(filterName) {
      this.filter = filterName;
      if (root.ChatWaveApp) root.ChatWaveApp.renderChatList();
    }

    setSearch(query) {
      this.search = (query || '').toLowerCase().trim();
      if (root.ChatWaveApp) root.ChatWaveApp.renderChatList();
    }
  }

  return new SidebarComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Sidebar/SidebarComponent.js'), sidebarContent);
console.log('Created SidebarComponent.js');

// 14. ChatViewComponent.js
const chatViewContent = `/**
 * ChatWave 3.0 - Message Thread View Component with WhatsApp Bubbles, Reactions, and Actions
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveChatView = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class ChatViewComponent {
    constructor() {}

    formatTime(ts) {
      if (!ts) return '';
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    renderBubble(msg, currentUserId, isGroup = false) {
      const isOut = msg.from_id === currentUserId;
      const dir = isOut ? 'out' : 'in';
      const tick = isOut ? (msg.status === 'read' ? '<span class="cw-tick read">??</span>' : '<span class="cw-tick sent">??</span>') : '';
      const timeStr = this.formatTime(msg.created_at || Date.now());

      let bodyHtml = '';
      if (msg.type === 'text') {
        bodyHtml = \`<div class="cw-bubble-text">\${msg.content}</div>\`;
      } else if (msg.type === 'image') {
        bodyHtml = \`<img src="\${msg.url}" class="cw-bubble-media" onclick="ChatWaveApp.viewMedia('\${msg.url}')" />\`;
      } else if (msg.type === 'video') {
        bodyHtml = \`<video src="\${msg.url}" controls class="cw-bubble-media"></video>\`;
      } else if (msg.type === 'audio') {
        bodyHtml = \`<audio src="\${msg.url}" controls class="cw-bubble-audio"></audio>\`;
      } else if (msg.type === 'document') {
        bodyHtml = \`<div class="cw-bubble-doc">?? <span>\${msg.file_name || 'Document'}</span> <a href="\${msg.url}" download>? Save</a></div>\`;
      } else if (msg.type === 'miniapp_chess') {
        bodyHtml = \`<div class="cw-bubble-miniapp">?? <b>Chess Match</b><p>\${msg.content}</p><button class="cw-btn-mini" onclick="ChatWaveApp.openMiniApp('chess')">Open Board</button></div>\`;
      } else if (msg.type === 'miniapp_ttt') {
        bodyHtml = \`<div class="cw-bubble-miniapp">?? <b>Tic-Tac-Toe</b><p>\${msg.content}</p><button class="cw-btn-mini" onclick="ChatWaveApp.openMiniApp('tictactoe')">Play</button></div>\`;
      } else if (msg.type === 'soundboard') {
        bodyHtml = \`<div class="cw-bubble-soundboard">\${msg.content}</div>\`;
      }

      return \`
        <div class="cw-msg-bubble \${dir}" id="m_\${msg.id}">
          <div class="cw-bubble-inner">
            \${!isOut && isGroup ? \`<div class="cw-bubble-sender">\${msg.from_name || 'User'}</div>\` : ''}
            \${bodyHtml}
            <div class="cw-bubble-meta">
              <span class="cw-bubble-time">\${timeStr}</span>
              \${tick}
            </div>
          </div>
        </div>
      \`;
    }
  }

  return new ChatViewComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Chat/ChatViewComponent.js'), chatViewContent);
console.log('Created ChatViewComponent.js');

// 15. MessageInputComponent.js
const messageInputContent = `/**
 * ChatWave 3.0 - Message Input Component with Voice Recorder, Slash Commands, and Dropzone
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveMessageInput = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class MessageInputComponent {
    constructor() {
      this.isRecordingVoice = false;
      this.mediaRecorder = null;
      this.audioChunks = [];
    }

    async toggleVoiceRecording() {
      if (!this.isRecordingVoice) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          this.mediaRecorder = new MediaRecorder(stream);
          this.audioChunks = [];
          this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
          this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onload = () => {
              if (root.ChatWaveApp) {
                root.ChatWaveApp.sendMessage({
                  type: 'audio',
                  url: reader.result,
                  content: '?? Voice note'
                });
              }
            };
            reader.readAsDataURL(blob);
          };
          this.mediaRecorder.start();
          this.isRecordingVoice = true;
          if (root.ChatWaveApp.toast) root.ChatWaveApp.toast('??? Recording voice note...', 'info');
        } catch (e) {
          console.error('Audio recording failed:', e);
        }
      } else {
        if (this.mediaRecorder) {
          this.mediaRecorder.stop();
          this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
        }
        this.isRecordingVoice = false;
      }
    }
  }

  return new MessageInputComponent();
}));
`;
fs.writeFileSync(path.join(compDir, 'Input/MessageInputComponent.js'), messageInputContent);
console.log('Created MessageInputComponent.js');
