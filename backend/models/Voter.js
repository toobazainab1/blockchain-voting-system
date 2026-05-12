const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VoterSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'], trim: true,
  },
  voterID: {
    type: String, required: [true, 'Voter ID is required'],
    unique: true, trim: true,
  },
  password: {
    type: String, required: [true, 'Password is required'], minlength: 6, select: false,
  },
  avatarId: { type: String, default: 'v' },
  pfp: { type: String, default: null },
  status: {
    type: String, enum: ['pending', 'verified', 'flagged'], default: 'verified',
  },
  flagReason: { type: String, default: '' },
  votedIn: [{ type: String }],
  role: { type: String, enum: ['voter', 'admin'], default: 'voter' },
}, { timestamps: true });

// Hash password before saving
VoterSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
VoterSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Voter', VoterSchema);