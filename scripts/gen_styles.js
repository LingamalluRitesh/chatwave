const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, '../src/styles');
if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir, { recursive: true });

// 1. variables.css
const variablesCss = `/**
 * ChatWave 3.0 - Design Tokens & Global CSS Variables
 */
:root {
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;
  --glass-blur: blur(20px) saturate(180%);
}

[data-theme="dark"] {
  --bg-primary: #111b21;
  --bg-gradient: radial-gradient(circle at 15% 15%, rgba(0, 168, 132, 0.12) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(11, 20, 26, 0.8) 0%, transparent 40%), #111b21;
  --bg-secondary: #111b21;
  --bg-tertiary: #202c33;
  --bg-input: #2a3942;
  --bg-msg-in: #202c33;
  --bg-msg-out: #005c4b;
  --text-msg-out: #e9edef;
  --text-msg-out-time: rgba(233, 237, 239, 0.7);
  --bg-hover: #202c33;
  --bg-sidebar: #111b21;
  --bg-header: #202c33;
  --bg-modal: #222e35;
  --bg-auth: #111b21;
  --text-primary: #e9edef;
  --text-secondary: #8696a0;
  --text-muted: #667781;
  --border: rgba(134, 150, 160, 0.15);
  --border-glow: rgba(0, 168, 132, 0.4);
  --accent: #00a884;
  --accent-dark: #008f6f;
  --accent-gradient: linear-gradient(135deg, #00a884, #029070);
  --shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  --unread: #00a884;
}

[data-theme="light"] {
  --bg-primary: #efeae2;
  --bg-gradient: #efeae2;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f0f2f5;
  --bg-input: #ffffff;
  --bg-msg-in: #ffffff;
  --bg-msg-out: #d9fdd3;
  --text-msg-out: #111b21;
  --text-msg-out-time: #667781;
  --bg-hover: #f5f6f6;
  --bg-sidebar: #ffffff;
  --bg-header: #f0f2f5;
  --bg-modal: #ffffff;
  --bg-auth: #ffffff;
  --text-primary: #111b21;
  --text-secondary: #54656f;
  --text-muted: #8696a0;
  --border: rgba(0, 0, 0, 0.08);
  --border-glow: rgba(0, 168, 132, 0.3);
  --accent: #00a884;
  --accent-dark: #008f6f;
  --accent-gradient: linear-gradient(135deg, #00a884, #029070);
  --shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.8);
  --unread: #25d366;
}

[data-theme="cyberpunk"] {
  --bg-primary: #090d16;
  --bg-gradient: radial-gradient(circle at 15% 15%, rgba(6, 182, 212, 0.15) 0%, transparent 40%), #090d16;
  --bg-secondary: #0f172a;
  --bg-tertiary: #1e1b4b;
  --bg-input: #1e293b;
  --bg-msg-in: #1e1b4b;
  --bg-msg-out: #0e7490;
  --text-msg-out: #ffffff;
  --text-msg-out-time: rgba(255, 255, 255, 0.7);
  --bg-hover: #1e293b;
  --bg-sidebar: #090d16;
  --bg-header: #0f172a;
  --bg-modal: #0f172a;
  --bg-auth: #090d16;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border: rgba(6, 182, 212, 0.2);
  --border-glow: rgba(6, 182, 212, 0.6);
  --accent: #06b6d4;
  --accent-dark: #0891b2;
  --accent-gradient: linear-gradient(135deg, #06b6d4, #a855f7);
  --shadow: 0 16px 40px -8px rgba(6, 182, 212, 0.3);
  --unread: #06b6d4;
}
`;
fs.writeFileSync(path.join(stylesDir, 'variables.css'), variablesCss);
console.log('Created variables.css');

// 2. miniapps.css
const miniappsCss = `/**
 * ChatWave 3.0 - Mini-Apps & Games Styling
 */
.cw-miniapps-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.cw-miniapps-nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}

.cw-miniapps-tab {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--border);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition);
}

.cw-miniapps-tab.active, .cw-miniapps-tab:hover {
  background: var(--accent-gradient);
  color: white;
  border-color: transparent;
}

/* Chess */
.cw-chess-board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  max-width: 380px;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.cw-chess-sq {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.cw-chess-sq.light { background: #efeae2; }
.cw-chess-sq.dark { background: #005c4b; }
.cw-chess-sq.selected { background: #f59e0b !important; }
.cw-chess-sq.valid-target { background: rgba(59, 130, 246, 0.5) !important; }

.cw-chess-piece.white-piece { color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.6); }
.cw-chess-piece.black-piece { color: #111b21; text-shadow: 0 1px 2px rgba(255,255,255,0.4); }

.cw-chess-dot {
  width: 12px;
  height: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}

.cw-chess-info {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Tic-Tac-Toe */
.cw-ttt-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-width: 300px;
  margin: 0 auto 16px;
}

.cw-ttt-cell {
  aspect-ratio: 1 / 1;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 32px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition);
}

.cw-ttt-cell:hover {
  background: var(--bg-hover);
  transform: scale(1.02);
}

.cw-ttt-cell.win-cell {
  background: rgba(0, 168, 132, 0.3);
  border-color: var(--accent);
}

.cell-x { color: #ef4444; }
.cell-o { color: #3b82f6; }

.cw-ttt-status {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.cw-ttt-score {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Wordle */
.cw-wordle-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  margin-bottom: 16px;
}

.cw-wordle-row {
  display: flex;
  gap: 6px;
}

.cw-wordle-tile {
  width: 44px;
  height: 44px;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
}

.cw-wordle-tile.active { border-color: var(--accent); }
.cw-wordle-tile.correct { background: #22c55e; border-color: #22c55e; color: white; }
.cw-wordle-tile.present { background: #eab308; border-color: #eab308; color: white; }
.cw-wordle-tile.absent { background: #475569; border-color: #475569; color: white; }

.cw-wordle-kb {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}

.cw-wordle-kb-row {
  display: flex;
  gap: 4px;
}

.cw-wordle-key {
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
}

.cw-wordle-key.wide {
  padding: 10px 16px;
  font-size: 11px;
}

/* 2048 */
.cw-2048-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  background: #0f172a;
  padding: 12px;
  border-radius: var(--radius-lg);
  max-width: 320px;
  margin: 0 auto 16px;
}

.cw-2048-cell {
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
}

.cw-2048-cell.tile-2 { background: #e2e8f0; color: #1e293b; }
.cw-2048-cell.tile-4 { background: #fed7aa; color: #7c2d12; }
.cw-2048-cell.tile-8 { background: #f97316; color: white; }
.cw-2048-cell.tile-16 { background: #ef4444; color: white; }
.cw-2048-cell.tile-32 { background: #ec4899; color: white; }
.cw-2048-cell.tile-64 { background: #8b5cf6; color: white; }
.cw-2048-cell.tile-128 { background: #3b82f6; color: white; }
.cw-2048-cell.tile-256 { background: #10b981; color: white; }
.cw-2048-cell.tile-512 { background: #eab308; color: white; }
.cw-2048-cell.tile-1024 { background: #06b6d4; color: white; }
.cw-2048-cell.tile-2048 { background: #f43f5e; color: white; box-shadow: 0 0 16px #f43f5e; }

.cw-2048-header {
  display: flex;
  justify-content: space-between;
  max-width: 320px;
  margin: 0 auto 12px;
  font-size: 15px;
}

.cw-2048-dpad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.cw-2048-dpad button {
  padding: 10px 18px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 16px;
  cursor: pointer;
}

/* Trivia */
.cw-trivia-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
}

.cw-trivia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.cw-trivia-badge {
  background: var(--accent);
  color: white;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-weight: 700;
}

.cw-trivia-question {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 20px;
}

.cw-trivia-opts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cw-trivia-opt {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}

.cw-trivia-opt:hover {
  border-color: var(--accent);
  background: var(--bg-hover);
}

.cw-trivia-opt.correct {
  background: rgba(34, 197, 94, 0.2);
  border-color: #22c55e;
  color: #4ade80;
}

.cw-trivia-opt.wrong {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #f87171;
}

.cw-trivia-explain {
  margin-top: 14px;
  font-size: 13px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
}

.cw-btn-mini {
  padding: 6px 14px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.cw-btn-primary {
  padding: 12px 20px;
  border-radius: var(--radius-full);
  background: var(--accent-gradient);
  color: white;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 168, 132, 0.4);
}
`;
fs.writeFileSync(path.join(stylesDir, 'miniapps.css'), miniappsCss);
console.log('Created miniapps.css');
