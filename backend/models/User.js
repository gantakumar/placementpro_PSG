const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  role:          { type: String, enum: ['student', 'admin', 'holder'], default: 'student' },
  // Approval workflow: alumni (role 'admin') who self-register start as 'pending'
  // until a website holder (role 'holder') approves them. Students and
  // holder-created admins are 'active' immediately.
  status:        { type: String, enum: ['active', 'pending', 'rejected'], default: 'active' },
  roll_no:       { type: String, default: '' },
  branch:        { type: String, default: '' },
  cgpa:          { type: Number, default: null },
  phone:         { type: String, default: '' },
  dept:          { type: String, default: '' },
  // Alumni-only: which role they will play inside the Alumni Portal.
  position:      { type: String, enum: ['', 'Placement Coordinator', 'Alumni Mentor', 'Guest Lecturer', 'Training & Placement Officer', 'Entrepreneurship', 'Higher Studies / Research'], default: '' },
  college:       { type: String, default: '' },
  section:       { type: String, default: '' },
  year:          { type: String, default: '' },
  // Alumni verification details — used to confirm the person really is a
  // Kongu Engineering College alumnus before a holder approves them.
  graduation_year: { type: String, default: '' },
  degree:          { type: String, default: '' },
  // Set true when the account e-mail is on the official @kongu.edu domain.
  college_email_verified: { type: Boolean, default: false },
  // Profile personalisation — available to every role (student / alumni / holder).
  // `avatar` holds a small square image as a data-URL (jpeg/png/webp, <= ~1.5MB).
  avatar:        { type: String, default: '' },
  // A short quote or self-bio shown under the profile name.
  bio:           { type: String, default: '', maxlength: 300 },

  // ── Alumni-connect fields (used by the alumni directory, mentorship
  //    slots and referral requests). Mostly relevant for role 'admin'.
  company:          { type: String, default: '' },
  job_title:        { type: String, default: '' },
  experience_years: { type: Number, default: null },
  skills:           { type: [String], default: [] },
  linkedin:         { type: String, default: '' },
  // Alumni can switch these off when they are busy.
  open_to_mentorship: { type: Boolean, default: true },
  open_to_referral:   { type: Boolean, default: true },
  // Student side: dream companies, used to surface relevant alumni.
  dream_companies:  { type: [String], default: [] },

  // ── Presence ─────────────────────────────────────────────────
  // Refreshed on every authenticated API call and by the client's
  // heartbeat. A user counts as "online" when this is within ~1 minute.
  last_seen:        { type: Date, default: null },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', userSchema);
