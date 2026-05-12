const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route GET /api/admin/voters
router.get('/voters', protect, adminOnly, async (req, res) => {
  try {
    const voters = await Voter.find({ role: 'voter' }).sort({ createdAt: -1 });
    res.json({ success: true, voters });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/admin/voters/:id/flag
router.put('/voters/:id/flag', protect, adminOnly, async (req, res) => {
  try {
    const { reason } = req.body;
    const voter = await Voter.findByIdAndUpdate(
      req.params.id,
      { status: 'flagged', flagReason: reason || 'Flagged by admin' },
      { new: true }
    );
    res.json({ success: true, voter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/admin/voters/:id/unflag
router.put('/voters/:id/unflag', protect, adminOnly, async (req, res) => {
  try {
    const voter = await Voter.findByIdAndUpdate(
      req.params.id,
      { status: 'verified', flagReason: '' },
      { new: true }
    );
    res.json({ success: true, voter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/admin/voters/:id/verify
router.put('/voters/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const voter = await Voter.findByIdAndUpdate(
      req.params.id,
      { status: 'verified', flagReason: '' },
      { new: true }
    );
    res.json({ success: true, voter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalElections  = await Election.countDocuments();
    const openElections   = await Election.countDocuments({ status: 'open' });
    const totalVoters     = await Voter.countDocuments({ role: 'voter' });
    const verifiedVoters  = await Voter.countDocuments({ status: 'verified', role: 'voter' });
    const flaggedVoters   = await Voter.countDocuments({ status: 'flagged' });
    const totalVotes      = await Vote.countDocuments();
    const totalCandidates = await Candidate.countDocuments();
    res.json({
      success: true,
      stats: { totalElections, openElections, totalVoters, verifiedVoters, flaggedVoters, totalVotes, totalCandidates },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;