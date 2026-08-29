/**
 * Real-time In-Room Polling & Anonymous Voting Engine.
 * Supports single/multiple choice options, voter fingerprint deduplication, and live tally statistics.
 */

class RoomPollingEngine {
  constructor() {
    this.polls = new Map();
  }

  createPoll(pollId, roomId, question, options = []) {
    if (options.length < 2) {
      throw new Error("Poll must contain at least 2 options.");
    }

    const poll = {
      id: pollId,
      roomId,
      question,
      options: options.map((opt, idx) => ({ id: `opt_${idx}`, text: opt, votes: 0 })),
      voterHashes: new Set(),
      isClosed: false,
      createdAt: Date.now(),
    };

    this.polls.set(pollId, poll);
    return poll;
  }

  castVote(pollId, voterHash, optionId) {
    const poll = this.polls.get(pollId);
    if (!poll) throw new Error("Poll not found.");
    if (poll.isClosed) throw new Error("Poll is closed for voting.");
    if (poll.voterHashes.has(voterHash)) throw new Error("User has already voted in this poll.");

    const option = poll.options.find((o) => o.id === optionId);
    if (!option) throw new Error("Invalid option selected.");

    option.votes += 1;
    poll.voterHashes.add(voterHash);

    return this.getPollResults(pollId);
  }

  getPollResults(pollId) {
    const poll = this.polls.get(pollId);
    if (!poll) throw new Error("Poll not found.");

    const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
    const breakdown = poll.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      votes: opt.votes,
      percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 1000) / 10 : 0.0,
    }));

    return {
      pollId: poll.id,
      roomId: poll.roomId,
      question: poll.question,
      totalVotes,
      isClosed: poll.isClosed,
      options: breakdown,
    };
  }

  closePoll(pollId) {
    const poll = this.polls.get(pollId);
    if (poll) poll.isClosed = true;
    return this.getPollResults(pollId);
  }
}

module.exports = { RoomPollingEngine };
