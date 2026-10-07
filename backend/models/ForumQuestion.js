// models/ForumQuestion.js — Public Q&A forum. Students ask, alumni answer.
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:    { type: String, required: true, trim: true, maxlength: 4000 },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  accepted:{ type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
}, { _id: true });

const questionSchema = new mongoose.Schema({
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true, trim: true, maxlength: 200 },
  body:    { type: String, default: '', maxlength: 4000 },
  company: { type: String, default: '' },
  tags:    { type: [String], default: [] },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  answers: { type: [answerSchema], default: [] },
  solved:  { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ForumQuestion', questionSchema);
