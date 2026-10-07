const mongoose = require('mongoose');

const completedRoundSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  round:   { type: String, required: true },
});

// Mirrors the UNIQUE(user_id, company, round) + "INSERT IGNORE" behaviour from MySQL
completedRoundSchema.index({ user_id: 1, company: 1, round: 1 }, { unique: true });

module.exports = mongoose.model('CompletedRound', completedRoundSchema);
