// routes/mentorship.js — /api/mentorship.php
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const MentorSlot = require('../models/MentorSlot');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

function slotDTO(s, alumni, student) {
  return {
    id: s._id,
    kind: s.kind,
    topic: s.topic,
    company: s.company || '',
    start_at: s.start_at,
    duration: s.duration,
    meet_link: s.meet_link || '',
    notes: s.notes || '',
    status: s.status,
    student_note: s.student_note || '',
    feedback: s.feedback || '',
    rating: s.rating ?? null,
    student_review: s.student_review || '',
    alumni: alumni ? { id: alumni._id, name: alumni.name, company: alumni.company || '', job_title: alumni.job_title || '', avatar: alumni.avatar || '' } : null,
    student: student ? { id: student._id, name: student.name, branch: student.branch || student.dept || '', roll_no: student.roll_no || '' } : null,
  };
}

async function hydrate(slots) {
  const ids = [...new Set(slots.flatMap((s) => [String(s.alumni), s.student ? String(s.student) : null]).filter(Boolean))];
  const users = await User.find({ _id: { $in: ids } }).select('name company job_title avatar branch dept roll_no').lean();
  const map = Object.fromEntries(users.map((u) => [String(u._id), u]));
  return slots.map((s) => slotDTO(s, map[String(s.alumni)], s.student ? map[String(s.student)] : null));
}

// ── GET /api/mentorship.php/available — open future slots (students) ──
router.get('/available', requireAuth(), async (req, res) => {
  try {
    const filter = { status: 'open', start_at: { $gt: new Date() } };
    if (req.query.alumni) filter.alumni = req.query.alumni;
    if (req.query.kind) filter.kind = req.query.kind;
    const slots = await MentorSlot.find(filter).sort({ start_at: 1 }).lean();
    return jsonOk(res, { slots: await hydrate(slots) });
  } catch (err) {
    console.error('Mentorship available error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load available slots.' });
  }
});

// ── GET /api/mentorship.php/my — my sessions (both roles) ─────────────
router.get('/my', requireAuth(), async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? { alumni: req.user._id } : { student: req.user._id };
    const slots = await MentorSlot.find(filter).sort({ start_at: 1 }).lean();
    return jsonOk(res, { slots: await hydrate(slots) });
  } catch (err) {
    console.error('Mentorship my error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load your sessions.' });
  }
});

// ── POST /api/mentorship.php/slots — alumni creates a slot ────────────
router.post('/slots', requireAuth('admin'), async (req, res) => {
  try {
    const { kind, topic, company, start_at, duration, meet_link, notes } = req.body || {};
    if (!topic || !String(topic).trim()) return jsonErr(res, 'Topic is required.');
    if (!start_at) return jsonErr(res, 'Date & time is required.');
    const when = new Date(start_at);
    if (isNaN(when.getTime())) return jsonErr(res, 'Invalid date & time.');
    if (when.getTime() < Date.now()) return jsonErr(res, 'Slot must be in the future.');

    const slot = await MentorSlot.create({
      alumni: req.user._id,
      kind: kind === 'mock' ? 'mock' : 'mentorship',
      topic: String(topic).trim(),
      company: String(company || req.user.company || '').trim(),
      start_at: when,
      duration: Number(duration) > 0 ? Number(duration) : 30,
      meet_link: String(meet_link || '').trim(),
      notes: String(notes || '').trim(),
    });

    return jsonOk(res, { message: 'Slot published', slot: slotDTO(slot, req.user, null) });
  } catch (err) {
    console.error('Mentorship create error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create slot.' });
  }
});

// ── DELETE /api/mentorship.php/slots/:id ──────────────────────────────
router.delete('/slots/:id', requireAuth('admin'), async (req, res) => {
  try {
    const slot = await MentorSlot.findOne({ _id: req.params.id, alumni: req.user._id });
    if (!slot) return jsonErr(res, 'Slot not found.', 404);
    if (slot.status === 'booked') return jsonErr(res, 'Cancel the booking before removing this slot.');
    await slot.deleteOne();
    return jsonOk(res, { message: 'Slot removed' });
  } catch (err) {
    console.error('Mentorship delete error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete slot.' });
  }
});

// ── POST /api/mentorship.php/slots/:id/book — student books ───────────
router.post('/slots/:id/book', requireAuth('student'), async (req, res) => {
  try {
    const slot = await MentorSlot.findById(req.params.id);
    if (!slot) return jsonErr(res, 'Slot not found.', 404);
    if (slot.status !== 'open') return jsonErr(res, 'This slot is no longer available.');

    slot.status = 'booked';
    slot.student = req.user._id;
    slot.student_note = String((req.body || {}).note || '').slice(0, 600);
    await slot.save();

    return jsonOk(res, { message: 'Session booked! Check "My Sessions" for the meeting link.' });
  } catch (err) {
    console.error('Mentorship book error:', err);
    return res.status(500).json({ success: false, message: 'Failed to book session.' });
  }
});

// ── POST /api/mentorship.php/slots/:id/cancel — either side cancels ───
router.post('/slots/:id/cancel', requireAuth(), async (req, res) => {
  try {
    const slot = await MentorSlot.findById(req.params.id);
    if (!slot) return jsonErr(res, 'Slot not found.', 404);

    const isOwner = String(slot.alumni) === String(req.user._id);
    const isStudent = slot.student && String(slot.student) === String(req.user._id);
    if (!isOwner && !isStudent) return jsonErr(res, 'Access denied.', 403);

    if (isStudent) { slot.status = 'open'; slot.student = null; slot.student_note = ''; }
    else { slot.status = 'cancelled'; }
    await slot.save();

    return jsonOk(res, { message: 'Session cancelled' });
  } catch (err) {
    console.error('Mentorship cancel error:', err);
    return res.status(500).json({ success: false, message: 'Failed to cancel session.' });
  }
});

// ── POST /api/mentorship.php/slots/:id/feedback — alumni feedback ─────
router.post('/slots/:id/feedback', requireAuth('admin'), async (req, res) => {
  try {
    const slot = await MentorSlot.findOne({ _id: req.params.id, alumni: req.user._id });
    if (!slot) return jsonErr(res, 'Slot not found.', 404);
    slot.feedback = String((req.body || {}).feedback || '').slice(0, 2000);
    slot.status = 'completed';
    await slot.save();
    return jsonOk(res, { message: 'Feedback saved' });
  } catch (err) {
    console.error('Mentorship feedback error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save feedback.' });
  }
});

// ── POST /api/mentorship.php/slots/:id/review — student rates ─────────
router.post('/slots/:id/review', requireAuth('student'), async (req, res) => {
  try {
    const slot = await MentorSlot.findOne({ _id: req.params.id, student: req.user._id });
    if (!slot) return jsonErr(res, 'Session not found.', 404);
    const rating = Number((req.body || {}).rating);
    if (!(rating >= 1 && rating <= 5)) return jsonErr(res, 'Rating must be between 1 and 5.');
    slot.rating = rating;
    slot.student_review = String((req.body || {}).review || '').slice(0, 600);
    await slot.save();
    return jsonOk(res, { message: 'Thanks for the feedback!' });
  } catch (err) {
    console.error('Mentorship review error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
});

module.exports = router;
