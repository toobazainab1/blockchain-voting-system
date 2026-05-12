const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Voter = require('../models/Voter');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, voterID, password, avatarId } = req.body;
    if (!name || !voterID || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }
    const existing = await Voter.findOne({ voterID });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Voter ID already registered' });
    }
    const voter = await Voter.create({ name, voterID, password, avatarId: avatarId || 'v' });
    const token = signToken(voter._id);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      voter: {
        id: voter._id, name: voter.name, voterID: voter.voterID,
        avatarId: voter.avatarId, status: voter.status, role: voter.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { voterID, password } = req.body;
    if (!voterID || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Voter ID and password' });
    }
    const voter = await Voter.findOne({ voterID }).select('+password');
    if (!voter || !(await voter.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid Voter ID or password' });
    }
    if (voter.status === 'flagged') {
      return res.status(403).json({ success: false, message: `Account flagged: ${voter.flagReason}` });
    }
    const token = signToken(voter._id);
    res.json({
      success: true, token,
      voter: {
        id: voter._id, name: voter.name, voterID: voter.voterID,
        avatarId: voter.avatarId, pfp: voter.pfp,
        status: voter.status, role: voter.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const voter = await Voter.findById(decoded.id);
    if (!voter) return res.status(404).json({ success: false, message: 'Voter not found' });
    res.json({
      success: true,
      voter: {
        id: voter._id, name: voter.name, voterID: voter.voterID,
        avatarId: voter.avatarId, pfp: voter.pfp,
        status: voter.status, role: voter.role, votedIn: voter.votedIn,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/auth/update
router.put('/update', async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, avatarId, pfp } = req.body;
    const voter = await Voter.findByIdAndUpdate(decoded.id, { name, avatarId, pfp }, { new: true });
    res.json({ success: true, voter });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/auth/setup-admin
router.post('/setup-admin', async (req, res) => {
  try {
    const { secretKey } = req.body;
    if (secretKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid secret key' });
    }
    const existing = await Voter.findOne({ role: 'admin' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }
    const admin = await Voter.create({
      name: 'Admin',
      voterID: 'admin',
      password: 'admin123',
      role: 'admin',
      status: 'verified',
    });
    const token = signToken(admin._id);
    res.status(201).json({ success: true, message: 'Admin created successfully', token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;