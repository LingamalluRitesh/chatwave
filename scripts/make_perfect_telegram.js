const fs = require('fs');
const path = require('path');

let orig = fs.readFileSync('scripts/orig_index.html', 'utf8');

// 1. Update Title and Theme Color
orig = orig.replace('<title>ChatWave – Mobile Messaging App</title>', '<title>ChatWave 3.0 – Telegram Web Experience</title>');
orig = orig.replace('<title>ChatWave ΓÇô Mobile Messaging App</title>', '<title>ChatWave 3.0 – Telegram Web Experience</title>');
orig = orig.replace('content="#111b21"', 'content="#17212b"');

// 2. Replace CSS Theme Variables with Telegram Web Colors
const tgDarkVars = `    [data-theme="dark"] {
      --bg-primary: #0e1621;
      --bg-gradient: #0e1621;
      --bg-secondary: #17212b;
      --bg-tertiary: #242f3d;
      --bg-input: #242f3d;
      --bg-msg-in: #182533;
      --bg-msg-out: #2b5278;
      --text-msg-out: #ffffff;
      --text-msg-out-time: rgba(255, 255, 255, 0.7);
      --bg-hover: #202b36;
      --bg-sidebar: #17212b;
      --bg-header: #17212b;
      --bg-modal: #17212b;
      --bg-auth: #17212b;
      --text-primary: #f5f5f5;
      --text-secondary: #708499;
      --text-muted: #64788c;
      --border: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(51, 144, 236, 0.4);
      --accent: #3390ec;
      --accent-dark: #2481cc;
      --accent-gradient: linear-gradient(135deg, #3390ec, #50b0f7);
      --shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.6);
      --glass-blur: blur(20px);
      --unread: #3390ec;
    }
    [data-theme="light"] {
      --bg-primary: #f0f2f5;
      --bg-gradient: #f0f2f5;
      --bg-secondary: #ffffff;
      --bg-tertiary: #f4f4f5;
      --bg-input: #f4f4f5;
      --bg-msg-in: #ffffff;
      --bg-msg-out: #e1f3fb;
      --text-msg-out: #111827;
      --text-msg-out-time: #6b7280;
      --bg-hover: #f1f5f9;
      --bg-sidebar: #ffffff;
      --bg-header: #ffffff;
      --bg-modal: #ffffff;
      --bg-auth: #ffffff;
      --text-primary: #111827;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;
      --border: rgba(0, 0, 0, 0.08);
      --border-glow: rgba(51, 144, 236, 0.3);
      --accent: #3390ec;
      --accent-dark: #2481cc;
      --accent-gradient: linear-gradient(135deg, #3390ec, #50b0f7);
      --shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.08);
      --glass-blur: blur(20px);
      --unread: #3390ec;
    }`;

orig = orig.replace(/\[data-theme="dark"\]\s*\{[\s\S]*?\[data-theme="light"\]\s*\{[\s\S]*?\}/, tgDarkVars);

// 3. Add miniapps.css link in <head>
if (!orig.includes('miniapps.css')) {
  orig = orig.replace('</head>', '  <link rel="stylesheet" href="src/styles/miniapps.css" />\n</head>');
}

// 4. Add Mini-Apps / Whiteboard / Soundboard buttons to sidebar header
const sidebarBtns = `          <button class="icon-btn" onclick="openMiniAppsModal()" title="Mini-Apps & Games" style="font-size:18px">🎮</button>
          <button class="icon-btn" onclick="openWhiteboardModal()" title="Collaborative Whiteboard" style="font-size:18px">🎨</button>
          <button class="icon-btn" onclick="openSoundboardModal()" title="Soundboard FX" style="font-size:18px">🔊</button>`;

if (!orig.includes('openMiniAppsModal()') && orig.includes('class="sidebar-header"')) {
  orig = orig.replace(/(<div class="sidebar-header">[\s\S]*?<div class="sidebar-actions">)/, `$1\n${sidebarBtns}`);
}

// 5. Add Mini-Apps / Whiteboard buttons to chat header
const chatHeaderBtns = `          <button class="icon-btn" onclick="openMiniAppsModal()" title="Mini-Apps & Games" style="font-size:18px">🎮</button>
          <button class="icon-btn" onclick="openWhiteboardModal()" title="Whiteboard" style="font-size:18px">🎨</button>
          <button class="icon-btn" onclick="openSoundboardModal()" title="Soundboard FX" style="font-size:18px">🔊</button>`;

if (orig.includes('class="chat-header-actions"')) {
  orig = orig.replace(/(<div class="chat-header-actions">)/, `$1\n${chatHeaderBtns}`);
}

// 6. Add Modal Overlays
const modalOverlays = `
<!-- Telegram Mini-Apps Modal -->
<div class="modal-overlay hidden" id="cw-miniapps-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px">
  <div class="modal-card" style="background:var(--bg-modal);border:1px solid var(--border);border-radius:20px;max-width:540px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow)">
    <div class="modal-header" style="padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <h3 style="font-size:16px;font-weight:700">🎮 Telegram Mini-Apps & Games</h3>
      <button class="icon-btn" onclick="closeMiniAppsModal()">✕</button>
    </div>
    <div class="cw-miniapps-nav" style="padding:10px 16px 0;margin-bottom:0">
      <button class="cw-miniapps-tab active" onclick="switchMiniApp('chess', this)">♟️ Chess</button>
      <button class="cw-miniapps-tab" onclick="switchMiniApp('tictactoe', this)">🎮 Tic-Tac-Toe</button>
      <button class="cw-miniapps-tab" onclick="switchMiniApp('wordle', this)">🔤 Wordle</button>
      <button class="cw-miniapps-tab" onclick="switchMiniApp('2048', this)">🔢 2048</button>
      <button class="cw-miniapps-tab" onclick="switchMiniApp('trivia', this)">🏆 Trivia Quiz</button>
    </div>
    <div style="padding:16px 20px" id="cw-miniapp-host"></div>
  </div>
</div>

<!-- Collaborative Whiteboard Modal -->
<div class="modal-overlay hidden" id="cw-whiteboard-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px">
  <div class="modal-card" style="background:var(--bg-modal);border:1px solid var(--border);border-radius:20px;max-width:850px;width:95vw;height:85vh;box-shadow:var(--shadow);display:flex;flex-direction:column">
    <div class="modal-header" style="padding:12px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <h3 style="font-size:16px;font-weight:700">🎨 Collaborative Whiteboard</h3>
      <div style="display:flex;align-items:center;gap:6px">
        <button class="cw-btn-mini" onclick="ChatWaveWhiteboard.setTool('brush')">🖌️ Brush</button>
        <button class="cw-btn-mini" onclick="ChatWaveWhiteboard.setTool('eraser')">🧹 Eraser</button>
        <button class="cw-btn-mini" onclick="ChatWaveWhiteboard.setTool('rect')">⬜ Box</button>
        <button class="cw-btn-mini" onclick="ChatWaveWhiteboard.setTool('circle')">⭕ Circle</button>
        <input type="color" value="#3390ec" onchange="ChatWaveWhiteboard.setColor(this.value)" style="width:28px;height:28px;border-radius:50%;cursor:pointer" />
        <button class="cw-btn-mini" onclick="ChatWaveWhiteboard.undo()">↩ Undo</button>
        <button class="cw-btn-mini" onclick="ChatWaveWhiteboard.clear()">🗑️ Clear</button>
        <button class="cw-btn-primary" style="padding:6px 14px;font-size:12px" onclick="sendWhiteboardToChat()">Send to Chat 💬</button>
        <button class="icon-btn" onclick="closeWhiteboardModal()">✕</button>
      </div>
    </div>
    <div style="flex:1;position:relative;background:#0e1621">
      <canvas id="cw-whiteboard-canvas" style="width:100%;height:100%;display:block;touch-action:none;cursor:crosshair"></canvas>
    </div>
  </div>
</div>

<!-- Soundboard FX Modal -->
<div class="modal-overlay hidden" id="cw-soundboard-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px">
  <div class="modal-card" style="background:var(--bg-modal);border:1px solid var(--border);border-radius:20px;max-width:440px;width:100%;box-shadow:var(--shadow)">
    <div class="modal-header" style="padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
      <h3 style="font-size:16px;font-weight:700">🔊 Soundboard FX</h3>
      <button class="icon-btn" onclick="closeSoundboardModal()">✕</button>
    </div>
    <div style="padding:16px 20px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
      <button class="cw-trivia-opt" onclick="triggerSoundFX('pop')">🎈 Pop Bubble</button>
      <button class="cw-trivia-opt" onclick="triggerSoundFX('laser')">🔫 Laser Zap</button>
      <button class="cw-trivia-opt" onclick="triggerSoundFX('bell')">🔔 Notification Bell</button>
      <button class="cw-trivia-opt" onclick="triggerSoundFX('chime')">✨ Magic Chime</button>
      <button class="cw-trivia-opt" onclick="triggerSoundFX('horn')">🎺 Airhorn Meme</button>
      <button class="cw-trivia-opt" onclick="triggerSoundFX('bass')">🔊 Bass Drop</button>
      <button class="cw-trivia-opt" onclick="triggerSoundFX('win')">🏆 Victory Fanfare</button>
      <button class="cw-trivia-opt" onclick="triggerSoundFX('lose')">💀 Defeat Oof</button>
    </div>
  </div>
</div>
`;

if (!orig.includes('id="cw-miniapps-modal"')) {
  orig = orig.replace('<div id="toast-container"></div>', `${modalOverlays}\n<div id="toast-container"></div>`);
}

// 7. Add Mini-Apps Handlers & script tags
const scripts = [
  'src/data/emojis.js',
  'src/data/stickers.js',
  'src/data/soundPresets.js',
  'src/data/triviaQuestions.js',
  'src/data/wallpapers.js',
  'src/core/StateStore.js',
  'src/core/EventBus.js',
  'src/core/Router.js',
  'src/core/SoundSynthesizer.js',
  'src/core/ParticleEffects.js',
  'src/core/I18nEngine.js',
  'src/components/MiniApps/ChessGame.js',
  'src/components/MiniApps/TicTacToeGame.js',
  'src/components/MiniApps/WordleGame.js',
  'src/components/MiniApps/Game2048.js',
  'src/components/MiniApps/TriviaQuizGame.js',
  'src/components/MiniApps/CodePlayground.js',
  'src/components/Whiteboard/WhiteboardComponent.js',
  'src/components/AIAssistant/AIAssistantComponent.js',
  'src/components/Stories/StoriesComponent.js',
  'src/components/Polls/PollComponent.js',
  'src/components/ThemeStudio/ThemeStudioComponent.js',
  'src/components/Soundboard/SoundboardComponent.js',
  'src/components/Calls/CallModalComponent.js'
];

const scriptTags = scripts.map(s => `  <script src="${s}"></script>`).join('\n');

const miniAppHandlers = `
  // ── Mini-Apps & Whiteboard Handlers ──
  function openMiniAppsModal() {
    document.getElementById('cw-miniapps-modal').classList.remove('hidden');
    switchMiniApp('chess');
  }
  function closeMiniAppsModal() {
    document.getElementById('cw-miniapps-modal').classList.add('hidden');
  }
  function switchMiniApp(appName, btn) {
    if (btn) {
      document.querySelectorAll('.cw-miniapps-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    const host = document.getElementById('cw-miniapp-host');
    if (!host) return;
    host.innerHTML = '<div id="cw-' + appName + '-container"></div>';
    if (appName === 'chess' && window.ChatWaveChess) ChatWaveChess.render('cw-chess-container');
    else if (appName === 'tictactoe' && window.ChatWaveTicTacToe) ChatWaveTicTacToe.render('cw-tictactoe-container');
    else if (appName === 'wordle' && window.ChatWaveWordle) ChatWaveWordle.render('cw-wordle-container');
    else if (appName === '2048' && window.ChatWave2048) ChatWave2048.render('cw-2048-container');
    else if (appName === 'trivia' && window.ChatWaveTriviaGame) ChatWaveTriviaGame.start('all');
  }
  function openWhiteboardModal() {
    document.getElementById('cw-whiteboard-modal').classList.remove('hidden');
    setTimeout(() => {
      if (window.ChatWaveWhiteboard) ChatWaveWhiteboard.init('cw-whiteboard-canvas');
    }, 50);
  }
  function closeWhiteboardModal() {
    document.getElementById('cw-whiteboard-modal').classList.add('hidden');
  }
  function sendWhiteboardToChat() {
    if (window.ChatWaveWhiteboard) {
      const dataUrl = ChatWaveWhiteboard.toDataURL();
      if (dataUrl && typeof sendMsg === 'function') {
        sendMsg({ type: 'image', url: dataUrl, content: '🎨 Whiteboard Drawing' });
        closeWhiteboardModal();
        toast('Drawing sent to chat! 🎨', 'success');
      }
    }
  }
  function openSoundboardModal() {
    document.getElementById('cw-soundboard-modal').classList.remove('hidden');
  }
  function closeSoundboardModal() {
    document.getElementById('cw-soundboard-modal').classList.add('hidden');
  }
  function triggerSoundFX(snd) {
    if (window.ChatWaveSound) {
      if (snd === 'pop') ChatWaveSound.playPop();
      else if (snd === 'laser') ChatWaveSound.playLaser();
      else if (snd === 'bell') ChatWaveSound.playBell();
      else if (snd === 'chime') ChatWaveSound.playChime();
      else if (snd === 'horn') ChatWaveSound.playAirhorn();
      else if (snd === 'bass') ChatWaveSound.playBassDrop();
      else if (snd === 'win') ChatWaveSound.playVictory();
      else if (snd === 'lose') ChatWaveSound.playDefeat();
    }
    toast('Played: ' + snd.toUpperCase() + ' 🔊', 'info');
  }
`;

if (!orig.includes('openMiniAppsModal()')) {
  orig = orig.replace('</script>\n</body>', `${miniAppHandlers}\n</script>\n${scriptTags}\n</body>`);
} else {
  orig = orig.replace('</body>', `${scriptTags}\n</body>`);
}

fs.writeFileSync('index.html', orig, 'utf8');
fs.writeFileSync('www/index.html', orig, 'utf8');
console.log('Successfully written upgraded index.html & www/index.html');
