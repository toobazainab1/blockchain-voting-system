const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Voter = require('../models/Voter');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const { protect } = require('../middleware/auth');

// @route GET /api/votes/check/:electionId
router.get('/check/:electionId', protect, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      voterId: req.voter._id,
      electionId: req.params.electionId,
    });
    res.json({ success: true, hasVoted: !!vote, txHash: vote?.txHash || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/votes/cast
router.post('/cast', protect, async (req, res) => {
  try {
    const { electionId, candidateId, txHash, blockNumber } = req.body;
    if (!electionId || !candidateId) {
      return res.status(400).json({ success: false, message: 'Election and candidate required' });
    }
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });
    if (election.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Election is not currently open' });
    }
    if (req.voter.status === 'flagged') {
      return res.status(403).json({ success: false, message: `Account flagged: ${req.voter.flagReason}` });
    }
    const existingVote = await Vote.findOne({ voterId: req.voter._id, electionId });
    if (existingVote) {
      return res.status(400).json({ success: false, message: 'You have already voted in this election' });
    }
    const vote = await Vote.create({
      voterId: req.voter._id,
      electionId,
      candidateId,
      txHash: txHash || '',
      blockNumber: blockNumber || 0,
    });
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });
    await Election.findByIdAndUpdate(electionId, { $inc: { votedCount: 1 } });
    await Voter.findByIdAndUpdate(req.voter._id, { $push: { votedIn: electionId } });
    res.status(201).json({ success: true, vote });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already voted in this election' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/votes/results/:electionId
router.get('/results/:electionId', protect, async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId }).sort({ votes: -1 });
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    res.json({ success: true, candidates, totalVotes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/votes/my-votes
router.get('/my-votes', protect, async (req, res) => {
  try {
    const votes = await Vote.find({ voterId: req.voter._id })
      .populate('electionId', 'title')
      .populate('candidateId', 'name party');
    res.json({ success: true, votes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;