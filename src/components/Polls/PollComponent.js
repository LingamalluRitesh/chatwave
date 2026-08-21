/**
 * ChatWave 3.0 - In-Chat Live Polls & Quiz Generator
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWavePolls = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  class PollComponent {
    constructor() {}

    createPoll(question, options, isMultiple = false) {
      return {
        id: 'poll_' + Date.now(),
        question: question.trim(),
        options: options.map((opt, idx) => ({ id: idx, text: opt.trim(), votes: [] })),
        isMultiple,
        totalVotes: 0,
        createdAt: Date.now()
      };
    }

    vote(poll, optionId, userId) {
      if (!poll || !userId) return poll;
      
      poll.options.forEach(opt => {
        if (opt.id === optionId) {
          if (!opt.votes.includes(userId)) opt.votes.push(userId);
          else opt.votes = opt.votes.filter(u => u !== userId);
        } else if (!poll.isMultiple) {
          opt.votes = opt.votes.filter(u => u !== userId);
        }
      });

      let total = 0;
      poll.options.forEach(opt => total += opt.votes.length);
      poll.totalVotes = total;

      if (root.ChatWaveSound) root.ChatWaveSound.playButtonClick();
      return poll;
    }

    renderPollHTML(poll, currentUserId) {
      if (!poll) return '';
      const total = Math.max(1, poll.totalVotes);

      let optionsHtml = '';
      poll.options.forEach(opt => {
        const pct = Math.round((opt.votes.length / total) * 100);
        const hasVoted = opt.votes.includes(currentUserId);

        optionsHtml += `
          <div class="cw-poll-opt ${hasVoted ? 'voted' : ''}" onclick="ChatWaveApp.handlePollVote('${poll.id}', ${opt.id})">
            <div class="cw-poll-bar" style="width:${poll.totalVotes > 0 ? pct : 0}%"></div>
            <div class="cw-poll-opt-content">
              <span>${hasVoted ? '? ' : ''}${opt.text}</span>
              <b>${poll.totalVotes > 0 ? pct + '%' : ''}</b>
            </div>
          </div>
        `;
      });

      return `
        <div class="cw-poll-card" id="poll_${poll.id}">
          <div class="cw-poll-title">?? ${poll.question}</div>
          <div class="cw-poll-options">${optionsHtml}</div>
          <div class="cw-poll-footer">${poll.totalVotes} ${poll.totalVotes === 1 ? 'vote' : 'votes'} � Live Poll</div>
        </div>
      `;
    }
  }

  return new PollComponent();
}));
