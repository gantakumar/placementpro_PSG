// routes/referrals.js — /api/referrals.php
// Students request referrals from alumni; alumni accept / decline / mark referred.
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const ReferralRequest = require('../models/ReferralRequest');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

async function hydrate(rows) {
  const ids = [...new Set(rows.flatMap((r) => [String(r.student), String(r.alumni)]))];
  const users = await User.find({ _id: { $in: ids } }).select('name company job_title avatar branch dept roll_no cgpa').lean();
  const map = Object.fromEntries(users.map((u) => [String(u._id), u]));
  return rows.map((r) => {
    const s = map[String(r.student)] || {}; const a = map[String(r.alumni)] || {};
    return {
      id: r._id,
      company: r.company,
      role: r.role,
      job_link: r.job_link,
      resume_link: r.resume_link,
      message: r.message,
      status: r.status,
      response_note: r.response_note,
      created_at: r.created_at,
      student: { id: r.student, name: s.name || 'Unknown', branch: s.branch || s.dept || '', roll_no: s.roll_no || '', cgpa: s.cgpa ?? null },
      alumni: { id: r.alumni, name: a.name || 'Unknown', company: a.company || '', job_title: a.job_title || '', avatar: a.avatar || '' },
    };
  });
}

// ── GET /api/referrals.php — my referral requests (both roles) ──
router.get('/', requireAuth(), async (req, res) => {
  const filter = req.user.role === 'admin' ? { alumni: req.user._id } : { student: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  const rows = await ReferralRequest.find(filter).sort({ created_at: -1 }).lean();
  return jsonOk(res, { referrals: await hydrate(rows) });
});

// ── POST /api/referrals.php — student creates a request ─────────
router.post('/', requireAuth('student'), async (req, res) => {
  const b = req.body || {};
  if (!b.alumni) return jsonErr(res, 'Choose an alumnus to request from.');
  if (!b.company || !String(b.company).trim()) return jsonErr(res, 'Company is required.');
  if (!b.role || !String(b.role).trim()) return jsonErr(res, 'Role is required.');

  const alumni = await User.findOne({ _id: b.alumni, role: 'admin', status: 'active' }).lean();
  if (!alumni) return jsonErr(res, 'Alumni not found.', 404);
  if (alumni.open_to_referral === false) return jsonErr(res, 'This alumnus is not accepting referral requests right now.');

  const pending = await ReferralRequest.countDocuments({ student: req.user._id, alumni: alumni._id, status: 'pending' });
  if (pending) return jsonErr(res, 'You already have a pending request with this alumnus.');

  await ReferralRequest.create({
    student: req.user._id,
    alumni: alumni._id,
    company: String(b.company).trim(),
    role: String(b.role).trim(),
    job_link: String(b.job_link || '').trim(),
    resume_link: String(b.resume_link || '').trim(),
    message: String(b.message || '').slice(0, 1200),
  });

  return jsonOk(res, { message: 'Referral request sent' });
});

// ── POST /api/referrals.php/:id/status — alumni responds ────────
router.post('/:id/status', requireAuth('admin'), async (req, res) => {
  const status = (req.body || {}).status;
  if (!['accepted', 'referred', 'declined'].includes(status)) return jsonErr(res, 'Invalid status.');

  const r = await ReferralRequest.findOne({ _id: req.params.id, alumni: req.user._id });
  if (!r) return jsonErr(res, 'Request not found.', 404);

  r.status = status;
  r.response_note = String((req.body || {}).note || '').slice(0, 800);
  await r.save();

  return jsonOk(res, { message: 'Request updated' });
});

// ── GET /api/referrals.php/pending-count — badge for alumni ─────
router.get('/pending-count', requireAuth(), async (req, res) => {
  if (req.user.role !== 'admin') return jsonOk(res, { count: 0 });
  const count = await ReferralRequest.countDocuments({ alumni: req.user._id, status: 'pending' });
  return jsonOk(res, { count });
});

module.exports = router;
