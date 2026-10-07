const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  user_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company:   { type: String, required: true },
  round:     { type: String, required: true },
  score:     { type: Number, default: 0 },
  total_q:   { type: Number, default: 0 },
  correct_q: { type: Number, default: 0 },
  passed:    { type: Boolean, default: false },
  taken_at:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('ExamResult', examResultSchema);
