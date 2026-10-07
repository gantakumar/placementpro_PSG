// models/ReferralRequest.js — A student asks an alumnus for a referral at
// their company. The alumnus accepts / declines / marks it as referred.
const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alumni:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company:  { type: String, required: true, trim: true },
  role:     { type: String, required: true, trim: true },
  job_link: { type: String, default: '' },
  resume_link: { type: String, default: '' },
  message:  { type: String, default: '', maxlength: 1200 },
  status:   { type: String, enum: ['pending', 'accepted', 'referred', 'declined'], default: 'pending' },
  response_note: { type: String, default: '' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ReferralRequest', referralSchema);
