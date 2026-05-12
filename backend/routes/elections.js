const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route GET /api/elections
router.get('/', protect, async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    const now = new Date();
    for (const e of elections) {
      let newStatus = e.status;
      if (now >= e.startDate && now <= e.endDate) newStatus = 'open';
      else if (now > e.endDate) newStatus = 'closed';
      if (newStatus !== e.status) { e.status = newStatus; await e.save(); }
    }
    res.json({ success: true, elections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/elections/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });
    const candidates = await Candidate.find({ electionId: req.params.id });
    res.json({ success: true, election, candidates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/elections
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, category, description, startDate, endDate } = req.body;
    if (!title || !category || !description || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const election = await Election.create({ title, category, description, startDate, endDate });
    res.status(201).json({ success: true, election });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/elections/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, election });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/elections/:id/close
router.put('/:id/close', protect, adminOnly, async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id, { status: 'closed' }, { new: true }
    );
    res.json({ success: true, election });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/elections/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Election.findByIdAndDelete(req.params.id);
    await Candidate.deleteMany({ electionId: req.params.id });
    res.json({ success: true, message: 'Election deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;