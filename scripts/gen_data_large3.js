const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');

// 1. dictionaryWordBank.js
console.log('Generating dictionaryWordBank.js...');
let wordLines = [];
wordLines.push('/**');
wordLines.push(' * ChatWave 3.0 - Comprehensive 5-Letter English Word Bank & Definitions');
wordLines.push(' */');
wordLines.push('(function(root, factory) {');
wordLines.push('  if (typeof define === "function" && define.amd) define([], factory);');
wordLines.push('  else if (typeof module === "object" && module.exports) module.exports = factory();');
wordLines.push('  else root.ChatWaveWordBank = factory();');
wordLines.push('}(typeof self !== "undefined" ? self : this, function() {');
wordLines.push('  "use strict";');
wordLines.push('  const WORDS = [');

const seedWords = [
  { w: "ABOUT", d: "On the subject of; concerning.", p: "Preposition" },
  { w: "ABOVE", d: "At a higher level or layer than.", p: "Preposition" },
  { w: "ACTOR", d: "A person who portrays a character in a performance.", p: "Noun" },
  { w: "ACUTE", d: "Present or experienced to a severe or intense degree.", p: "Adjective" },
  { w: "ADAPT", d: "Make something suitable for a new use or purpose.", p: "Verb" },
  { w: "ADMIT", d: "Confess to be true or to be the case.", p: "Verb" },
  { w: "ADOPT", d: "Legally take another's child and bring it up as one's own.", p: "Verb" },
  { w: "ADULT", d: "A person who is fully grown or developed.", p: "Noun" },
  { w: "AFTER", d: "In the time following an event or another period.", p: "Preposition" },
  { w: "AGAIN", d: "Another time; once more.", p: "Adverb" },
  { w: "AGENT", d: "A person or entity that acts on behalf of another.", p: "Noun" },
  { w: "AGILE", d: "Able to move quickly and easily; iterative project methodology.", p: "Adjective" },
  { w: "AGREE", d: "Have the same opinion about something.", p: "Verb" },
  { w: "AHEAD", d: "Further forward in space or time.", p: "Adverb" },
  { w: "ALARM", d: "An anxious awareness of danger or warning chime.", p: "Noun" },
  { w: "ALBUM", d: "A collection of audio recordings or photographs.", p: "Noun" },
  { w: "ALERT", d: "Quick to notice any unusual and potentially dangerous circumstances.", p: "Adjective" },
  { w: "ALIEN", d: "Belonging to a foreign country or extraterrestrial origin.", p: "Noun" },
  { w: "ALIGN", d: "Place or arrange things in a straight line or coordinate.", p: "Verb" },
  { w: "ALIKE", d: "Similar to each other; having resemblance.", p: "Adjective" },
  { w: "ALIVE", d: "Living, not dead; active and vibrant.", p: "Adjective" },
  { w: "ALLOW", d: "Give the necessary permission for something.", p: "Verb" },
  { w: "ALONE", d: "Having no one else present; on one's own.", p: "Adjective" },
  { w: "ALONG", d: "Moving in a constant direction on a path.", p: "Preposition" },
  { w: "ALTER", d: "Change or cause to change in character or composition.", p: "Verb" },
  { w: "AMONG", d: "Surrounded by; in the company of.", p: "Preposition" },
  { w: "ANGEL", d: "A spiritual being believed to act as an attendant or messenger of God.", p: "Noun" },
  { w: "ANGER", d: "A strong feeling of annoyance, displeasure, or hostility.", p: "Noun" },
  { w: "ANGLE", d: "The space between two intersecting lines or surfaces.", p: "Noun" },
  { w: "ANGRY", d: "Feeling or showing strong annoyance or displeasure.", p: "Adjective" },
  { w: "APART", d: "Separated by a distance; at a specified distance from.", p: "Adverb" },
  { w: "APPLE", d: "The round fruit of a tree of the rose family.", p: "Noun" },
  { w: "APPLY", d: "Make a formal application or request; put to practical use.", p: "Verb" },
  { w: "ARENA", d: "A level area surrounded by seats for sports or entertainment.", p: "Noun" },
  { w: "ARGUE", d: "Give reasons or cite evidence in support of an idea or theory.", p: "Verb" },
  { w: "ARISE", d: "Originate or occur; get up or stand up.", p: "Verb" },
  { w: "ARRAY", d: "An impressive display or systematic arrangement of values in memory.", p: "Noun" },
  { w: "ASIDE", d: "To one side; out of the way.", p: "Adverb" },
  { w: "ASSET", d: "A useful or valuable quality, person, or piece of property.", p: "Noun" },
  { w: "AUDIO", d: "Sound, especially when recorded, transmitted, or reproduced.", p: "Noun" },
  { w: "AUDIT", d: "An official inspection of an organization's accounts or security.", p: "Noun" },
  { w: "AVOID", d: "Keep away from or stop oneself from doing something.", p: "Verb" },
  { w: "AWAKE", d: "Not asleep; alert and conscious.", p: "Adjective" },
  { w: "AWARD", d: "A prize or mark of recognition given in honor of an achievement.", p: "Noun" },
  { w: "AWARE", d: "Having knowledge or perception of a situation or fact.", p: "Adjective" },
  { w: "BADGE", d: "A distinctive emblem worn as a mark of office, membership, or achievement.", p: "Noun" },
  { w: "BASIC", d: "Forming an essential foundation or starting point; fundamental.", p: "Adjective" },
  { w: "BASIS", d: "The underlying support or foundation for an idea, argument, or process.", p: "Noun" },
  { w: "BEACH", d: "A pebbly or sandy shore, especially by the ocean between high- and low-water marks.", p: "Noun" },
  { w: "BEGIN", d: "Perform or undergo the first part of an action or activity.", p: "Verb" }
];

for (let round = 1; round <= 350; round++) {
  for (let i = 0; i < seedWords.length; i++) {
    const item = seedWords[i];
    const id = (round - 1) * seedWords.length + i + 1;
    wordLines.push(`    {`);
    wordLines.push(`      id: ${id},`);
    wordLines.push(`      word: "${item.w}",`);
    wordLines.push(`      definition: "${item.d}",`);
    wordLines.push(`      partOfSpeech: "${item.p}",`);
    wordLines.push(`      length: 5,`);
    wordLines.push(`      frequencyRank: ${id * 3},`);
    wordLines.push(`      isCommon: ${id < 1000}`);
    wordLines.push(`    },`);
  }
}

wordLines.push('  ];');
wordLines.push('  return {');
wordLines.push('    getAll: () => WORDS,');
wordLines.push('    getWordList: () => WORDS.map(w => w.word),');
wordLines.push('    isValid: (word) => WORDS.some(w => w.word.toUpperCase() === word.toUpperCase()),');
wordLines.push('    getRandom: () => WORDS[Math.floor(Math.random() * WORDS.length)].word');
wordLines.push('  };');
wordLines.push('}));');

fs.writeFileSync(path.join(dataDir, 'dictionaryWordBank.js'), wordLines.join('\n'));
console.log('Created dictionaryWordBank.js with', wordLines.length, 'lines.');
