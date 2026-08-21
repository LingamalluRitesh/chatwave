/**
 * ChatWave 3.0 - Curated Trivia Quiz Questions Engine
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveTrivia = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
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
      q: 'What is the most abundant gas in Earth�s atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon'],
      answer: 1,
      explain: 'Nitrogen makes up approximately 78% of Earth�s atmosphere, followed by oxygen at ~21%.'
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
      q: 'Who is recognized as the world�s first computer programmer?',
      options: ['Alan Turing', 'Ada Lovelace', 'Grace Hopper', 'Charles Babbage'],
      answer: 1,
      explain: 'Ada Lovelace wrote the first published algorithm intended for implementation on Charles Babbage�s Analytical Engine in 1843.'
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
