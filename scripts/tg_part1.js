const fs = require('fs');
const path = require('path');

let p1 = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="theme-color" content="#17212b" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="ChatWave 3.0" />
  <title>ChatWave 3.0 – Telegram Web Experience</title>
  <link rel="manifest" href="/manifest.json" />
  <link rel="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/1384/1384055.png" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <link rel="stylesheet" href="src/styles/variables.css" />
  <link rel="stylesheet" href="src/styles/telegram.css" />
  <link rel="stylesheet" href="src/styles/miniapps.css" />
  <style>
    #auth-screen { position: fixed; inset: 0; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; }
    .tg-auth-card { background: var(--bg-auth); border: 1px solid var(--border); border-radius: 24px; padding: 36px 40px; width: 100%; max-width: 420px; box-shadow: var(--shadow); max-height: 90vh; overflow-y: auto; text-align: center; }
    .tg-auth-logo { width: 64px; height: 64px; border-radius: 50%; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px; color: white; box-shadow: 0 4px 16px rgba(51, 144, 236, 0.4); }
    .tg-auth-tabs { display: flex; gap: 6px; background: var(--bg-tertiary); border-radius: 12px; padding: 4px; margin: 20px 0 16px; }
    .tg-auth-tab { flex: 1; padding: 8px; border-radius: 8px; font-size: 13.5px; font-weight: 600; color: var(--text-secondary); transition: all var(--transition); }
    .tg-auth-tab.active { background: var(--accent); color: white; }
    .tg-auth-field { margin-bottom: 14px; text-align: left; }
    .tg-auth-field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px; }
    .tg-auth-input-wrap { display: flex; align-items: center; gap: 8px; background: var(--bg-input); border: 1.5px solid transparent; border-radius: 12px; padding: 10px 14px; }
    .tg-auth-input-wrap:focus-within { border-color: var(--accent); background: var(--bg-sidebar); }
    .tg-btn-primary { width: 100%; padding: 12px; border-radius: 12px; background: var(--accent-gradient); color: white; font-weight: 700; font-size: 14.5px; cursor: pointer; box-shadow: 0 4px 14px rgba(51, 144, 236, 0.4); margin-top: 6px; }
    .tg-auth-err { padding: 10px 14px; border-radius: 10px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; font-size: 13px; margin-bottom: 12px; }
    #loading-screen { position: fixed; inset: 0; background: var(--bg-primary); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 99999; gap: 14px; }
    .tg-spinner { width: 44px; height: 44px; border: 3.5px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    #toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 99999; display: flex; flex-direction: column; gap: 8px; }
    .toast { background: var(--bg-tertiary); border: 1px solid var(--border); border-radius: 12px; padding: 12px 18px; font-size: 13.5px; font-weight: 500; box-shadow: var(--shadow); color: var(--text-primary); }
    .toast.success { border-left: 4px solid #22c55e; }
    .toast.info { border-left: 4px solid var(--accent); }
    .toast.error { border-left: 4px solid #ef4444; }
  </style>
</head>
<body>
<div id="loading-screen"><div class="tg-spinner"></div><div id="loading-msg" style="font-size:14px;font-weight:500;color:var(--text-secondary)">Connecting to ChatWave...</div></div>
<div class="tg-drawer" id="tg-drawer">
  <div class="tg-drawer-header">
    <div class="tg-chat-avatar" id="drawer-avatar" style="width:60px;height:60px;font-size:22px;background:var(--accent-gradient)"><span id="drawer-initials">ME</span></div>
    <div><div id="drawer-name" style="font-size:16px;font-weight:700">My Account</div><div id="drawer-handle" style="font-size:13px;color:var(--text-secondary)">@username</div></div>
  </div>
  <div class="tg-drawer-menu">
    <div class="tg-menu-item" onclick="openMiniAppsModal(); toggleDrawer();"><span class="icon">🎮</span> <span>Mini-Apps & Games</span></div>
    <div class="tg-menu-item" onclick="openWhiteboardModal(); toggleDrawer();"><span class="icon">🎨</span> <span>Whiteboard</span></div>
    <div class="tg-menu-item" onclick="openSoundboardModal(); toggleDrawer();"><span class="icon">🔊</span> <span>Soundboard FX</span></div>
    <div class="tg-menu-item" onclick="toggleTheme();"><span class="icon">🌓</span> <span>Night Mode</span></div>
    <div class="tg-menu-item" onclick="openGroupModal(); toggleDrawer();"><span class="icon">👥</span> <span>New Group</span></div>
    <div class="tg-menu-item" onclick="installPWA(); toggleDrawer();"><span class="icon">📱</span> <span>Install App</span></div>
    <div style="border-top:1px solid var(--border);margin:8px 0"></div>
    <div class="tg-menu-item" onclick="doLogout()" style="color:#ef4444"><span class="icon" style="color:#ef4444">🚪</span> <span>Log Out</span></div>
  </div>
</div>
<div id="drawer-backdrop" class="hidden" onclick="toggleDrawer()" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999"></div>
`;

fs.writeFileSync('scripts/out_p1.txt', p1, 'utf8');
console.log('Saved Part 1');
