const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');

// 2. stickers.js
const stickersContent = `/**
 * ChatWave 3.0 - Sticker Packs (Wavey Mascot, Cyber Dudes, Cute Animals, Memes)
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveStickers = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const PACKS = [
    {
      id: 'wavey',
      name: 'Wavey the Mascot',
      icon: '??',
      stickers: [
        { id: 'w_hi', name: 'Wave Hello', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#00a884"/><path d="M30 45 Q50 20 70 45 Q50 70 30 45" fill="white"/><circle cx="40" cy="42" r="5" fill="#111b21"/><circle cx="60" cy="42" r="5" fill="#111b21"/><path d="M38 60 Q50 72 62 60" stroke="#111b21" stroke-width="4" fill="none" stroke-linecap="round"/></svg>' },
        { id: 'w_love', name: 'Wavey Love', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#ef4444"/><path d="M30 35 A12 12 0 0 1 50 48 A12 12 0 0 1 70 35 Q80 55 50 80 Q20 55 30 35 Z" fill="white"/><circle cx="42" cy="40" r="4" fill="#ef4444"/><circle cx="58" cy="40" r="4" fill="#ef4444"/></svg>' },
        { id: 'w_cool', name: 'Wavey Sunglasses', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#3b82f6"/><rect x="25" y="38" width="22" height="16" rx="4" fill="#111b21"/><rect x="53" y="38" width="22" height="16" rx="4" fill="#111b21"/><line x1="47" y1="45" x2="53" y2="45" stroke="#111b21" stroke-width="4"/><path d="M36 68 Q50 78 64 68" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/></svg>' },
        { id: 'w_party', name: 'Wavey Party', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#f59e0b"/><polygon points="30,20 40,40 20,40" fill="#ec4899"/><polygon points="70,18 80,38 60,38" fill="#8b5cf6"/><circle cx="38" cy="50" r="5" fill="#111b21"/><circle cx="62" cy="50" r="5" fill="#111b21"/><path d="M35 68 Q50 82 65 68" stroke="#111b21" stroke-width="5" fill="none" stroke-linecap="round"/></svg>' },
        { id: 'w_fire', name: 'Wavey Lit', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#111827"/><path d="M50 15 Q75 45 60 70 Q75 60 70 85 Q25 90 30 65 Q25 45 50 15 Z" fill="#f97316"/><path d="M50 35 Q65 55 55 70 Q65 65 60 80 Q35 85 40 68 Q35 55 50 35 Z" fill="#fbbf24"/></svg>' },
        { id: 'w_mindblown', name: 'Mind Blown', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="60" r="34" fill="#8b5cf6"/><path d="M20 30 Q50 5 80 30 Q65 40 50 35 Q35 40 20 30 Z" fill="#f43f5e"/><circle cx="38" cy="58" r="6" fill="#111b21"/><circle cx="62" cy="58" r="6" fill="#111b21"/><ellipse cx="50" cy="74" rx="8" ry="10" fill="#111b21"/></svg>' }
      ]
    },
    {
      id: 'cyber',
      name: 'Cyberpunk Neon',
      icon: '??',
      stickers: [
        { id: 'c_glitch', name: 'Glitch Skull', svg: '<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0f172a"/><circle cx="50" cy="45" r="28" fill="#06b6d4"/><rect x="40" y="65" width="20" height="14" fill="#06b6d4"/><circle cx="40" cy="45" r="7" fill="#0f172a"/><circle cx="60" cy="45" r="7" fill="#0f172a"/><line x1="15" y1="35" x2="85" y2="35" stroke="#f43f5e" stroke-width="2"/><line x1="10" y1="60" x2="90" y2="60" stroke="#a855f7" stroke-width="2"/></svg>' },
        { id: 'c_hacker', name: 'Access Granted', svg: '<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#022c22"/><text x="50" y="45" font-family="monospace" font-weight="bold" font-size="14" fill="#10b981" text-anchor="middle">ACCESS</text><text x="50" y="65" font-family="monospace" font-weight="bold" font-size="14" fill="#34d399" text-anchor="middle">GRANTED</text><circle cx="50" cy="50" r="44" stroke="#10b981" stroke-width="2" fill="none" stroke-dasharray="4,4"/></svg>' },
        { id: 'c_cpu', name: 'AI Quantum Core', svg: '<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#1e1b4b"/><rect x="30" y="30" width="40" height="40" rx="8" fill="#6366f1"/><text x="50" y="55" font-family="sans-serif" font-weight="bold" font-size="12" fill="white" text-anchor="middle">AI</text><line x1="50" y1="10" x2="50" y2="30" stroke="#818cf8" stroke-width="4"/><line x1="50" y1="70" x2="50" y2="90" stroke="#818cf8" stroke-width="4"/><line x1="10" y1="50" x2="30" y2="50" stroke="#818cf8" stroke-width="4"/><line x1="70" y1="50" x2="90" y2="50" stroke="#818cf8" stroke-width="4"/></svg>' }
      ]
    },
    {
      id: 'cats',
      name: 'Neko Cat Club',
      icon: '??',
      stickers: [
        { id: 'cat_vibing', name: 'Cat Vibing', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#fde047"/><polygon points="25,35 35,15 45,30" fill="#fde047"/><polygon points="55,30 65,15 75,35" fill="#fde047"/><path d="M35 50 Q40 45 45 50" stroke="#713f12" stroke-width="3" fill="none"/><path d="M55 50 Q60 45 65 50" stroke="#713f12" stroke-width="3" fill="none"/><ellipse cx="50" cy="60" rx="4" ry="3" fill="#ec4899"/><path d="M42 66 Q50 72 58 66" stroke="#713f12" stroke-width="3" fill="none"/></svg>' },
        { id: 'cat_angry', name: 'Cat Hiss', svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#f87171"/><polygon points="25,35 35,15 45,30" fill="#f87171"/><polygon points="55,30 65,15 75,35" fill="#f87171"/><line x1="32" y1="46" x2="44" y2="54" stroke="#450a0a" stroke-width="4"/><line x1="68" y1="46" x2="56" y2="54" stroke="#450a0a" stroke-width="4"/><path d="M42 68 Q50 58 58 68" stroke="#450a0a" stroke-width="4" fill="#450a0a"/></svg>' }
      ]
    }
  ];

  return {
    getPacks: () => PACKS,
    getPack: (id) => PACKS.find(p => p.id === id),
    getSticker: (id) => {
      for (const p of PACKS) {
        const found = p.stickers.find(s => s.id === id);
        if (found) return found;
      }
      return null;
    }
  };
}));
`;
fs.writeFileSync(path.join(dataDir, 'stickers.js'), stickersContent);
console.log('Created stickers.js');

// 3. soundPresets.js
const soundPresetsContent = `/**
 * ChatWave 3.0 - Synthesized Audio Frequencies & Sound Presets
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveSoundPresets = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  return {
    messageReceived: [
      { freq: 587.33, type: 'sine', duration: 0.1, gain: 0.2 },
      { freq: 880.00, type: 'sine', duration: 0.25, gain: 0.25, delay: 0.08 }
    ],
    messageSent: [
      { freq: 740.00, type: 'triangle', duration: 0.08, gain: 0.15 },
      { freq: 1108.73, type: 'sine', duration: 0.12, gain: 0.2, delay: 0.06 }
    ],
    callRinging: [
      { freq: 440, type: 'sine', duration: 0.4, gain: 0.3 },
      { freq: 480, type: 'sine', duration: 0.4, gain: 0.3 },
      { freq: 440, type: 'sine', duration: 0.4, gain: 0.3, delay: 0.6 },
      { freq: 480, type: 'sine', duration: 0.4, gain: 0.3, delay: 0.6 }
    ],
    callConnect: [
      { freq: 523.25, type: 'sine', duration: 0.15, gain: 0.25 },
      { freq: 659.25, type: 'sine', duration: 0.15, gain: 0.25, delay: 0.12 },
      { freq: 783.99, type: 'sine', duration: 0.25, gain: 0.3, delay: 0.24 }
    ],
    callHangup: [
      { freq: 493.88, type: 'sine', duration: 0.15, gain: 0.25 },
      { freq: 392.00, type: 'sine', duration: 0.25, gain: 0.2, delay: 0.12 }
    ],
    buttonClick: [
      { freq: 1200, type: 'triangle', duration: 0.03, gain: 0.08 }
    ],
    reactionPop: [
      { freq: 300, endFreq: 900, type: 'sine', duration: 0.12, gain: 0.22 }
    ],
    gameWin: [
      { freq: 523.25, type: 'triangle', duration: 0.12, gain: 0.25 },
      { freq: 659.25, type: 'triangle', duration: 0.12, gain: 0.25, delay: 0.1 },
      { freq: 783.99, type: 'triangle', duration: 0.12, gain: 0.25, delay: 0.2 },
      { freq: 1046.50, type: 'sine', duration: 0.35, gain: 0.3, delay: 0.3 }
    ],
    gameLose: [
      { freq: 392.00, type: 'sawtooth', duration: 0.18, gain: 0.2 },
      { freq: 349.23, type: 'sawtooth', duration: 0.18, gain: 0.2, delay: 0.15 },
      { freq: 329.63, type: 'sawtooth', duration: 0.18, gain: 0.2, delay: 0.3 },
      { freq: 261.63, type: 'sawtooth', duration: 0.35, gain: 0.25, delay: 0.45 }
    ],
    laserZap: [
      { freq: 1800, endFreq: 150, type: 'sawtooth', duration: 0.15, gain: 0.2 }
    ],
    aiTypingChime: [
      { freq: 987.77, type: 'sine', duration: 0.05, gain: 0.05 }
    ]
  };
}));
`;
fs.writeFileSync(path.join(dataDir, 'soundPresets.js'), soundPresetsContent);
console.log('Created soundPresets.js');

// 4. triviaQuestions.js
const triviaContent = `/**
 * ChatWave 3.0 - Curated Trivia Quiz Questions Engine
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveTrivia = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const QUESTIONS = [
    {
      id: 1,
      cat: 'Technology',
      q: 'Which programming language was created by Brendan Eich in just 10 days in 1995?',
      options: ['Python', 'Java', 'JavaScript', 'C++'],
      answer: 2,
      explain: 'Brendan Eich created JavaScript (originally named Mocha, then LiveScript) at Netscape in May 1995.'
    },
    {
      id: 2,
      cat: 'Technology',
      q: 'What does "HTTP" stand for in web terminology?',
      options: ['HyperText Transfer Protocol', 'HyperText Transmission Process', 'High Transfer Text Platform', 'Home Tool Transfer Path'],
      answer: 0,
      explain: 'HTTP stands for HyperText Transfer Protocol, the underlying protocol used by the World Wide Web.'
    },
    {
      id: 3,
      cat: 'Science',
      q: 'What is the most abundant gas in Earth’s atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
      answer: 1,
      explain: 'Nitrogen makes up approximately 78% of Earth’s atmosphere, followed by oxygen at ~21%.'
    },
    {
      id: 4,
      cat: 'Gaming',
      q: 'What is the best-selling video game of all time with over 300 million copies sold?',
      options: ['Tetris', 'Grand Theft Auto V', 'Minecraft', 'Wii Sports'],
      answer: 2,
      explain: 'Minecraft, developed by Mojang Studios, has sold over 300 million copies worldwide.'
    },
    {
      id: 5,
      cat: 'Geography',
      q: 'Which is the longest river in the world?',
      options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
      answer: 1,
      explain: 'The Nile River is traditionally considered the longest at approx. 6,650 km (4,132 miles).'
    },
    {
      id: 6,
      cat: 'Technology',
      q: 'What year was the original iPhone unveiled by Steve Jobs?',
      options: ['2005', '2006', '2007', '2008'],
      answer: 2,
      explain: 'Steve Jobs introduced the first iPhone on January 9, 2007 at Macworld San Francisco.'
    },
    {
      id: 7,
      cat: 'Pop Culture',
      q: 'In the movie "The Matrix", what color pill does Neo take to wake up to reality?',
      options: ['Blue Pill', 'Red Pill', 'Green Pill', 'Yellow Pill'],
      answer: 1,
      explain: 'Neo takes the Red Pill offered by Morpheus to disconnect from the Matrix and see the truth.'
    },
    {
      id: 8,
      cat: 'Science',
      q: 'What is the speed of light in a vacuum approximately?',
      options: ['150,000 km/s', '300,000 km/s', '500,000 km/s', '1,000,000 km/s'],
      answer: 1,
      explain: 'The speed of light in vacuum is approximately 299,792 km/s (roughly 300,000 km/s).'
    },
    {
      id: 9,
      cat: 'Technology',
      q: 'What does "SQL" stand for in database architecture?',
      options: ['Structured Query Language', 'Simple Question Logic', 'System Quantitative Link', 'Sequential Query Loop'],
      answer: 0,
      explain: 'SQL stands for Structured Query Language, designed for managing relational database management systems.'
    },
    {
      id: 10,
      cat: 'History',
      q: 'Who is recognized as the world’s first computer programmer?',
      options: ['Alan Turing', 'Ada Lovelace', 'Grace Hopper', 'Charles Babbage'],
      answer: 1,
      explain: 'Ada Lovelace wrote the first published algorithm intended for implementation on Charles Babbage’s Analytical Engine in 1843.'
    }
  ];

  return {
    getAll: () => QUESTIONS,
    getRandom: (count = 5) => {
      const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
    getByCategory: (cat) => QUESTIONS.filter(q => q.cat.toLowerCase() === cat.toLowerCase())
  };
}));
`;
fs.writeFileSync(path.join(dataDir, 'triviaQuestions.js'), triviaContent);
console.log('Created triviaQuestions.js');

// 5. wallpapers.js
const wallpapersContent = `/**
 * ChatWave 3.0 - Curated Chat Wallpaper Patterns & Gradients
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveWallpapers = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const WALLPAPERS = [
    {
      id: 'default_dark',
      name: 'Default ChatWave Dark',
      type: 'gradient',
      css: 'radial-gradient(circle at 15% 15%, rgba(0, 168, 132, 0.12) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(11, 20, 26, 0.8) 0%, transparent 40%), #111b21',
      thumb: '#111b21'
    },
    {
      id: 'whatsapp_doodle',
      name: 'WhatsApp Classic Doodles',
      type: 'pattern',
      css: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2300a884\' fill-opacity=\'0.06\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E"), #111b21',
      thumb: '#005c4b'
    },
    {
      id: 'cyberpunk_neon',
      name: 'Cyberpunk Neon Matrix',
      type: 'gradient',
      css: 'linear-gradient(135deg, #090d16 0%, #1e1035 50%, #061e2d 100%)',
      thumb: '#1e1035'
    },
    {
      id: 'emerald_aurora',
      name: 'Emerald Aurora',
      type: 'gradient',
      css: 'radial-gradient(ellipse at bottom, #064e3b 0%, #022c22 45%, #051410 100%)',
      thumb: '#064e3b'
    },
    {
      id: 'nordic_night',
      name: 'Nordic Midnight',
      type: 'gradient',
      css: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      thumb: '#0f172a'
    },
    {
      id: 'sunset_glow',
      name: 'Sunset Glow',
      type: 'gradient',
      css: 'linear-gradient(135deg, #2b1055 0%, #75225b 50%, #b33939 100%)',
      thumb: '#75225b'
    },
    {
      id: 'minimal_light',
      name: 'Paper Cream Light',
      type: 'gradient',
      css: '#efeae2',
      thumb: '#efeae2'
    }
  ];

  return {
    getAll: () => WALLPAPERS,
    getById: (id) => WALLPAPERS.find(w => w.id === id) || WALLPAPERS[0]
  };
}));
`;
fs.writeFileSync(path.join(dataDir, 'wallpapers.js'), wallpapersContent);
console.log('Created wallpapers.js');
