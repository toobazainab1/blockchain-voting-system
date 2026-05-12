const adminOnly = (req, res, next) => {
  if (!req.voter || req.voter.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { adminOnly };