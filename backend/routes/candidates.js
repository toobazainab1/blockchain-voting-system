const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// @route GET /api/candidates
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.query.electionId ? { electionId: req.query.electionId } : {};
    const candidates = await Candidate.find(filter);
    res.json({ success: true, candidates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/candidates
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { electionId, name, party, manifesto, avatarCls } = req.body;
    if (!electionId || !name || !party) {
      return res.status(400).json({ success: false, message: 'Election, name and party required' });
    }
    const candidate = await Candidate.create({ electionId, name, party, manifesto, avatarCls });
    res.status(201).json({ success: true, candidate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/candidates/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, candidate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/candidates/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;