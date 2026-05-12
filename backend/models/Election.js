const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Student Council', 'Faculty', 'Department', 'General'] },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'open', 'closed'], default: 'pending' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalVoters: { type: Number, default: 0 },
  votedCount: { type: Number, default: 0 },
  integrityScore: { type: Number, default: 100 },
  contractElectionId: { type: Number, default: null },
  winner: {
    name: String, party: String, pct: Number, avatarCls: String,
  },
}, { timestamps: true });

// Auto update status based on dates
ElectionSchema.methods.updateStatus = function () {
  const now = new Date();
  if (now >= this.startDate && now <= this.endDate) this.status = 'open';
  else if (now > this.endDate) this.status = 'closed';
  else this.status = 'pending';
};

module.exports = mongoose.model('Election', ElectionSchema);