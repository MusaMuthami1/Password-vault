const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  device: String,
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  valid: { type: Boolean, default: true }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  googleId: { type: String, sparse: true }, // For Google OAuth
  githubId: { type: String, sparse: true }, // For GitHub OAuth
  isVerified: { type: Boolean, default: false },
  otp: {
    code: String,
    expires: Date
  },
  twoFactorEnabled: { type: Boolean, default: false },
  sessions: [sessionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
