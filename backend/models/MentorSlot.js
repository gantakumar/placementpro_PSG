// models/MentorSlot.js — Mentorship / mock-interview slots published by alumni
// and booked by students. One document = one bookable slot.
const mongoose = require('mongoose');

const mentorSlotSchema = new mongoose.Schema({
  alumni:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // 'mentorship' = general guidance call, 'mock' = mock interview.
  kind:        { type: String, enum: ['mentorship', 'mock'], default: 'mentorship' },
  topic:       { type: String, required: true, trim: true },
  company:     { type: String, default: '' },
  start_at:    { type: Date, required: true },
  duration:    { type: Number, default: 30 }, // minutes
  meet_link:   { type: String, default: '' },
  notes:       { type: String, default: '' },

  status:      { type: String, enum: ['open', 'booked', 'completed', 'cancelled'], default: 'open' },
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  student_note:{ type: String, default: '' },

  // Filled in by the alumni after a mock interview / mentorship call.
  feedback:    { type: String, default: '' },
  rating:      { type: Number, default: null }, // 1-5, given by the student
  student_review: { type: String, default: '' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('MentorSlot', mentorSlotSchema);
