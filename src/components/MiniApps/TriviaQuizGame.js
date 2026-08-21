/**
 * ChatWave 3.0 - Interactive Trivia Quiz Party
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveTriviaGame = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const QUESTIONS = [
    { q: "What does HTML stand for?", opts: ["HyperText Markup Language", "HighText Machine Language", "Hyperlink Text Mode", "Home Tool Markup"], ans: 0 },
    { q: "Which planet is known as the Red Planet?", opts: ["Venus", "Mars", "Jupiter", "Saturn"], ans: 1 },
    { q: "What is the speed of light in vacuum?", opts: ["300,000 km/s", "150,000 km/s", "1,000 km/s", "30,000 km/s"], ans: 0 },
    { q: "Who wrote 'Romeo and Juliet'?", opts: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], ans: 1 },
    { q: "What is the capital of Japan?", opts: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], ans: 2 }
  ];

  class TriviaQuiz {
    constructor() {
      this.questions = QUESTIONS;
      this.currentIdx = 0;
      this.score = 0;
      this.selectedAnswer = null;
      this.isFinished = false;
      this.containerId = null;
    }

    start(category, containerId) {
      if (containerId) this.containerId = containerId;
      this.currentIdx = 0;
      this.score = 0;
      this.selectedAnswer = null;
      this.isFinished = false;
      this.render();
    }

    chooseAnswer(index) {
      if (this.selectedAnswer !== null || this.isFinished) return;
      this.selectedAnswer = index;
      const isCorrect = index === this.questions[this.currentIdx].ans;

      if (isCorrect) {
        this.score += 100;
        if (window.ChatWaveSound) window.ChatWaveSound.playVictory();
        if (window.ChatWaveParticles) window.ChatWaveParticles.burst(window.innerWidth / 2, window.innerHeight / 2, 30);
      } else {
        if (window.ChatWaveSound) window.ChatWaveSound.playDefeat();
      }

      this.render();
      setTimeout(() => {
        if (this.currentIdx + 1 < this.questions.length) {
          this.currentIdx++;
          this.selectedAnswer = null;
          this.render();
        } else {
          this.isFinished = true;
          this.render();
        }
      }, 1400);
    }

    render(containerId) {
      if (typeof document === "undefined") return;
      const host = document.getElementById(this.containerId || 'cw-miniapp-host');
      if (!host) return;

      if (this.isFinished) {
        host.innerHTML = `
          <div class="cw-miniapp-card" style="text-align:center;padding:32px 16px">
            <div style="font-size:48px;margin-bottom:12px">🏆</div>
            <div class="cw-miniapp-title">Quiz Completed!</div>
            <div style="font-size:18px;font-weight:700;color:var(--accent);margin:12px 0">Final Score: ${this.score} pts</div>
            <button class="cw-btn-primary" style="padding:10px 24px" onclick="ChatWaveTriviaGame.start('all')">Play Again 🔄</button>
          </div>
        `;
        return;
      }

      const q = this.questions[this.currentIdx];
      let html = `
        <div class="cw-miniapp-card">
          <div class="cw-miniapp-header">
            <div>
              <div class="cw-miniapp-title">🏆 Trivia Quiz</div>
              <div class="cw-miniapp-subtitle">Question ${this.currentIdx + 1} of ${this.questions.length} | Score: ${this.score}</div>
            </div>
          </div>
          <div style="font-size:16px;font-weight:600;margin:16px 0;line-height:1.4">${q.q}</div>
          <div class="cw-trivia-options">
      `;

      q.opts.forEach((opt, idx) => {
        let cls = 'cw-trivia-opt';
        if (this.selectedAnswer !== null) {
          if (idx === q.ans) cls += ' correct';
          else if (idx === this.selectedAnswer) cls += ' wrong';
        }
        html += `<button class="${cls}" onclick="ChatWaveTriviaGame.chooseAnswer(${idx})">${opt}</button>`;
      });

      html += `
          </div>
        </div>
      `;

      host.innerHTML = html;
    }
  }

  const quiz = new TriviaQuiz();
  return {
    start: (cat, cId) => quiz.start(cat, cId),
    chooseAnswer: (idx) => quiz.chooseAnswer(idx)
  };
}));
