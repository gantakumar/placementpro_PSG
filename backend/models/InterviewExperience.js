// models/InterviewExperience.js — Company-wise interview experiences shared by
// alumni (and optionally by placed students) for juniors to learn from.
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:  { type: String, required: true, trim: true, maxlength: 800 },
  created_at: { type: Date, default: Date.now },
}, { _id: true });

const roundSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  details:   { type: String, default: '' },
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company:  { type: String, required: true, trim: true },
  role:     { type: String, default: '' },
  year:     { type: String, default: '' },
  ctc:      { type: String, default: '' },
  // 'selected' | 'rejected' | 'in-process'
  result:   { type: String, enum: ['selected', 'rejected', 'in-process'], default: 'selected' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Very Hard'], default: 'Medium' },
  rounds:   { type: [roundSchema], default: [] },
  tips:     { type: String, default: '' },
  upvotes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: { type: [commentSchema], default: [] },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('InterviewExperience', experienceSchema);
