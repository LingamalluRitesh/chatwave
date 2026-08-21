/**
 * ChatWave 3.0 - 24-Hour Stories & Status Updates System
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveStories = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
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

      let html = `
        <div class="cw-story-ring my-story" onclick="ChatWaveStories.openCreator()">
          <div class="cw-story-avatar add-icon">+</div>
          <span>Your Status</span>
        </div>
      `;

      this.stories.forEach((st, sIdx) => {
        html += `
          <div class="cw-story-ring" onclick="ChatWaveStories.viewStory(${sIdx})">
            <div class="cw-story-avatar" style="background:${st.user.color || '#3b82f6'}">
              <span>${st.user.name.charAt(0)}</span>
            </div>
            <span>${st.user.name.split(' ')[0]}</span>
          </div>
        `;
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

      modal.innerHTML = `
        <div class="cw-story-viewer" style="background:${item.bg || '#111b21'}">
          <div class="cw-story-progress-bars">
            ${st.items.map((it, idx) => `<div class="cw-story-bar ${idx === this.activeItemIndex ? 'active' : (idx < this.activeItemIndex ? 'done' : '')}"></div>`).join('')}
          </div>
          <div class="cw-story-top">
            <b>${st.user.name}</b>
            <button onclick="ChatWaveStories.closeViewer()">?</button>
          </div>
          <div class="cw-story-body">
            ${item.type === 'image' ? `<img src="${item.url}" />` : `<div class="cw-story-text">${item.content}</div>`}
          </div>
          <div class="cw-story-controls">
            <button onclick="ChatWaveStories.prevItem()">?</button>
            <button onclick="ChatWaveStories.nextItem()">?</button>
          </div>
        </div>
      `;

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
