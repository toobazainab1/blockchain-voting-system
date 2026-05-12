const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  name: { type: String, required: true, trim: true },
  party: { type: String, required: true, trim: true },
  manifesto: { type: String, default: '' },
  avatarCls: { type: String, default: 'avatar-v' },
  contractCandidateId: { type: Number, default: null },
  votes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);