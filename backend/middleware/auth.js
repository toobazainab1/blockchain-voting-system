const jwt = require('jsonwebtoken');
const Voter = require('../models/Voter');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.voter = await Voter.findById(decoded.id);

    if (!req.voter) {
      return res.status(401).json({ success: false, message: 'Voter not found' });
    }

    if (req.voter.status === 'flagged') {
      return res.status(403).json({ success: false, message: `Account flagged: ${req.voter.flagReason}` });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

module.exports = { protect };