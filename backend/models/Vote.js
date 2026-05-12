const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  voterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voter', required: true },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  txHash: { type: String, default: '' },
  blockNumber: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent duplicate votes
VoteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);