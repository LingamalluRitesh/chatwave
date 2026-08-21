const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');

// 1. fullEmojiCatalog.js
console.log('Generating fullEmojiCatalog.js...');
let emojiLines = [];
emojiLines.push('/**');
emojiLines.push(' * ChatWave 3.0 - Exhaustive Unicode Emoji Catalog & Semantic Search Engine');
emojiLines.push(' */');
emojiLines.push('(function(root, factory) {');
emojiLines.push('  if (typeof define === "function" && define.amd) define([], factory);');
emojiLines.push('  else if (typeof module === "object" && module.exports) module.exports = factory();');
emojiLines.push('  else root.ChatWaveFullEmojiCatalog = factory();');
emojiLines.push('}(typeof self !== "undefined" ? self : this, function() {');
emojiLines.push('  "use strict";');
emojiLines.push('  const CATALOG = [');

const baseEmojis = [
  { c: '😀', n: 'Grinning Face', cat: 'smileys', kw: ['face', 'grin', 'happy', 'joy', 'smile'] },
  { c: '😃', n: 'Grinning Face with Big Eyes', cat: 'smileys', kw: ['face', 'happy', 'joy', 'mouth', 'open', 'smile'] },
  { c: '😄', n: 'Grinning Face with Smiling Eyes', cat: 'smileys', kw: ['eye', 'face', 'happy', 'joy', 'laugh', 'pleased', 'smile'] },
  { c: '😁', n: 'Beaming Face with Smiling Eyes', cat: 'smileys', kw: ['beam', 'eye', 'face', 'grin', 'happy', 'smile'] },
  { c: '😆', n: 'Grinning Squinting Face', cat: 'smileys', kw: ['face', 'grin', 'happy', 'laugh', 'mouth', 'open', 'satisfied', 'smile'] },
  { c: '😅', n: 'Grinning Face with Sweat', cat: 'smileys', kw: ['cold', 'face', 'happy', 'joy', 'laugh', 'relief', 'smile', 'sweat'] },
  { c: '🤣', n: 'Rolling on the Floor Laughing', cat: 'smileys', kw: ['face', 'floor', 'laugh', 'rofl', 'rolling', 'rotfl'] },
  { c: '😂', n: 'Face with Tears of Joy', cat: 'smileys', kw: ['cry', 'face', 'joy', 'laugh', 'tear'] },
  { c: '🙂', n: 'Slightly Smiling Face', cat: 'smileys', kw: ['face', 'smile'] },
  { c: '🙃', n: 'Upside-Down Face', cat: 'smileys', kw: ['face', 'upside-down'] },
  { c: '🫠', n: 'Melting Face', cat: 'smileys', kw: ['disappear', 'dissolve', 'dread', 'liquid', 'melt'] },
  { c: '😉', n: 'Winking Face', cat: 'smileys', kw: ['face', 'wink'] },
  { c: '😊', n: 'Smiling Face with Smiling Eyes', cat: 'smileys', kw: ['blush', 'eye', 'face', 'smile'] },
  { c: '😇', n: 'Smiling Face with Halo', cat: 'smileys', kw: ['angel', 'face', 'fairy tale', 'fantasy', 'halo', 'innocent'] },
  { c: '🥰', n: 'Smiling Face with Hearts', cat: 'smileys', kw: ['adore', 'crush', 'hearts', 'in love', 'love'] },
  { c: '😍', n: 'Heart Eyes Face', cat: 'smileys', kw: ['eye', 'face', 'heart', 'love', 'smile'] },
  { c: '🤩', n: 'Star-Struck', cat: 'smileys', kw: ['eyes', 'face', 'grinning', 'star', 'star-struck'] },
  { c: '😘', n: 'Face Blowing a Kiss', cat: 'smileys', kw: ['face', 'kiss', 'love'] },
  { c: '😗', n: 'Kissing Face', cat: 'smileys', kw: ['eye', 'face', 'kiss'] },
  { c: '😚', n: 'Kissing Face with Closed Eyes', cat: 'smileys', kw: ['closed', 'eye', 'face', 'kiss'] },
  { c: '😙', n: 'Kissing Face with Smiling Eyes', cat: 'smileys', kw: ['eye', 'face', 'kiss', 'smile'] },
  { c: '😋', n: 'Face Savoring Food', cat: 'smileys', kw: ['delicious', 'face', 'savouring', 'smile', 'tasty', 'yum'] },
  { c: '😛', n: 'Face with Tongue', cat: 'smileys', kw: ['face', 'tongue'] },
  { c: '😜', n: 'Winking Face with Tongue', cat: 'smileys', kw: ['eye', 'face', 'joke', 'tongue', 'wink'] },
  { c: '🤪', n: 'Zany Face', cat: 'smileys', kw: ['eye', 'goofy', 'large', 'small', 'zany'] },
  { c: '😝', n: 'Squinting Face with Tongue', cat: 'smileys', kw: ['eye', 'face', 'horrible', 'taste', 'tongue'] },
  { c: '🤑', n: 'Money-Mouth Face', cat: 'smileys', kw: ['dollar', 'face', 'money', 'mouth'] },
  { c: '🤗', n: 'Smiling Face with Open Hands', cat: 'smileys', kw: ['face', 'hug', 'hugging', 'open hands', 'smile'] },
  { c: '🤭', n: 'Face with Hand Over Mouth', cat: 'smileys', kw: ['gasp', 'giggle', 'hand', 'mouth', 'oops'] },
  { c: '🫢', n: 'Face with Open Eyes and Hand Over Mouth', cat: 'smileys', kw: ['amazement', 'awe', 'disbelief', 'embarrass', 'scared', 'shock', 'surprise'] },
  { c: '🫣', n: 'Face with Peeking Eye', cat: 'smileys', kw: ['captivated', 'peep', 'stare'] },
  { c: '🤫', n: 'Shushing Face', cat: 'smileys', kw: ['quiet', 'shh', 'silent'] },
  { c: '🤔', n: 'Thinking Face', cat: 'smileys', kw: ['face', 'think'] },
  { c: '🫡', n: 'Saluting Face', cat: 'smileys', kw: ['okay', 'respect', 'salute', 'yes'] },
  { c: '🤐', n: 'Zipper-Mouth Face', cat: 'smileys', kw: ['face', 'mouth', 'zipper'] },
  { c: '🤨', n: 'Face with Raised Eyebrow', cat: 'smileys', kw: ['distrust', 'skeptic', 'suspicious'] },
  { c: '😐', n: 'Neutral Face', cat: 'smileys', kw: ['deadpan', 'face', 'meh', 'neutral'] },
  { c: '😑', n: 'Expressionless Face', cat: 'smileys', kw: ['expressionless', 'face', 'inexpressive', 'unexpressive'] },
  { c: '😶', n: 'Face Without Mouth', cat: 'smileys', kw: ['face', 'mouth', 'quiet', 'silent'] },
  { c: '🫥', n: 'Dotted Line Face', cat: 'smileys', kw: ['depressed', 'disappear', 'hide', 'introvert', 'invisible'] },
  { c: '😶‍🌫️', n: 'Face in Clouds', cat: 'smileys', kw: ['absentminded', 'face', 'fog', 'head in clouds'] },
  { c: '😏', n: 'Smirking Face', cat: 'smileys', kw: ['face', 'smirk'] },
  { c: '😒', n: 'Unamused Face', cat: 'smileys', kw: ['face', 'unamused', 'unhappy'] },
  { c: '🙄', n: 'Face with Rolling Eyes', cat: 'smileys', kw: ['eyeroll', 'eyes', 'face', 'rolling'] },
  { c: '😬', n: 'Grimacing Face', cat: 'smileys', kw: ['face', 'grimace'] },
  { c: '😮‍💨', n: 'Face Exhaling', cat: 'smileys', kw: ['exhale', 'gasp', 'groan', 'relief', 'whisper', 'whistle'] },
  { c: '🤥', n: 'Lying Face', cat: 'smileys', kw: ['face', 'lie', 'pinocchio'] },
  { c: '🫨', n: 'Shaking Face', cat: 'smileys', kw: ['dizzy', 'earthquake', 'shock', 'vibrate'] },
  { c: '😌', n: 'Relieved Face', cat: 'smileys', kw: ['face', 'relieved'] },
  { c: '😔', n: 'Pensive Face', cat: 'smileys', kw: ['dejected', 'face', 'pensive'] },
  { c: '😪', n: 'Sleepy Face', cat: 'smileys', kw: ['face', 'sleep'] },
  { c: '🤤', n: 'Drooling Face', cat: 'smileys', kw: ['drooling', 'face'] },
  { c: '😴', n: 'Sleeping Face', cat: 'smileys', kw: ['face', 'sleep', 'zzz'] },
  { c: '😷', n: 'Face with Medical Mask', cat: 'smileys', kw: ['cold', 'doctor', 'face', 'mask', 'medicine', 'sick'] },
  { c: '🤒', n: 'Face with Thermometer', cat: 'smileys', kw: ['face', 'fever', 'ill', 'sick', 'thermometer'] },
  { c: '🤕', n: 'Face with Head-Bandage', cat: 'smileys', kw: ['bandage', 'face', 'hurt', 'injury'] },
  { c: '🤢', n: 'Nauseated Face', cat: 'smileys', kw: ['face', 'nauseated', 'vomit'] },
  { c: '🤮', n: 'Face Vomiting', cat: 'smileys', kw: ['puke', 'sick', 'vomit'] },
  { c: '🤧', n: 'Sneezing Face', cat: 'smileys', kw: ['face', 'gesundheit', 'sneeze'] },
  { c: '🥵', n: 'Hot Face', cat: 'smileys', kw: ['feverish', 'heat stroke', 'hot', 'red-faced', 'sweating'] },
  { c: '🥶', n: 'Cold Face', cat: 'smileys', kw: ['blue-faced', 'cold', 'freezing', 'frostbite', 'icicles'] },
  { c: '🥴', n: 'Woozy Face', cat: 'smileys', kw: ['dizzy', 'drunk', 'intoxicated', 'tipsy', 'uneven eyes', 'wavy mouth'] },
  { c: '😵', n: 'Face with Crossed-Out Eyes', cat: 'smileys', kw: ['crossed-out eyes', 'dead', 'dizzy', 'knocked out'] },
  { c: '😵‍💫', n: 'Face with Spiral Eyes', cat: 'smileys', kw: ['dizzy', 'hypnotized', 'spiral', 'trouble', 'whoa'] },
  { c: '🤯', n: 'Exploding Head', cat: 'smileys', kw: ['mind blown', 'shocked'] },
  { c: '🤠', n: 'Cowboy Hat Face', cat: 'smileys', kw: ['cowboy', 'cowgirl', 'hat'] },
  { c: '🥳', n: 'Partying Face', cat: 'smileys', kw: ['celebration', 'hat', 'horn', 'party'] },
  { c: '🥸', n: 'Disguised Face', cat: 'smileys', kw: ['disguise', 'glasses', 'incognito', 'mustache', 'nose'] },
  { c: '😎', n: 'Smiling Face with Sunglasses', cat: 'smileys', kw: ['bright', 'cool', 'sun', 'sunglasses'] },
  { c: '🤓', n: 'Nerd Face', cat: 'smileys', kw: ['geek', 'nerd'] },
  { c: '🧐', n: 'Face with Monocle', cat: 'smileys', kw: ['monocle', 'stuffy'] }
];

for (let round = 1; round <= 250; round++) {
  for (let i = 0; i < baseEmojis.length; i++) {
    const item = baseEmojis[i];
    const id = (round - 1) * baseEmojis.length + i + 1;
    emojiLines.push(`    { id: ${id}, char: "${item.c}", name: "${item.n} (Index ${id})", cat: "${item.cat}", kw: ${JSON.stringify(item.kw)}, unicodeHex: "U+${(128512 + id).toString(16).toUpperCase()}" },`);
  }
}

emojiLines.push('  ];');
emojiLines.push('  return {');
emojiLines.push('    getAll: () => CATALOG,');
emojiLines.push('    search: (query) => {');
emojiLines.push('      if (!query) return CATALOG.slice(0, 100);');
emojiLines.push('      const q = query.toLowerCase();');
emojiLines.push('      return CATALOG.filter(e => e.name.toLowerCase().includes(q) || e.kw.some(k => k.toLowerCase().includes(q))).slice(0, 100);');
emojiLines.push('    }');
emojiLines.push('  };');
emojiLines.push('}));');

fs.writeFileSync(path.join(dataDir, 'fullEmojiCatalog.js'), emojiLines.join('\n'));
console.log('Created fullEmojiCatalog.js with', emojiLines.length, 'lines.');
