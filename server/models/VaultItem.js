const mongoose = require('mongoose');

const customFieldSchema = new mongoose.Schema({
  id: { type: Number, default: Date.now },
  name: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, enum: ['text', 'password', 'email', 'url', 'number', 'date'], default: 'text' }
}, { _id: false });

const vaultItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }, // Encrypted
  url: String,
  notes: String,
  category: { type: String, default: 'Website' },
  favorite: { type: Boolean, default: false },
  tags: [String],
  customFields: [customFieldSchema],
  lastPasswordChange: { type: Date, default: Date.now },
  strength: { type: Number, min: 0, max: 4 }, // Password strength score
  compromised: { type: Boolean, default: false }, // If found in breach
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
vaultItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('VaultItem', vaultItemSchema);
