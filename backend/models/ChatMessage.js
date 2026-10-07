const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  from:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:    { type: String, required: true, trim: true, maxlength: 2000 },
  read:    { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

chatMessageSchema.index({ from: 1, to: 1, created_at: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
