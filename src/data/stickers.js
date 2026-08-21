/**
 * ChatWave 3.0 - Sticker Packs (Wavey Mascot, Cyber Dudes, Cute Animals, Memes)
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveStickers = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
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
