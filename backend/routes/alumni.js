// routes/alumni.js — GET /api/alumni.php — Alumni directory for students.
// Search + filter approved alumni by company, role, batch, branch or skills.
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const MentorSlot = require('../models/MentorSlot');
const InterviewExperience = require('../models/InterviewExperience');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

function esc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function publicCard(u) {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    avatar: u.avatar || '',
    bio: u.bio || '',
    position: u.position || '',
    company: u.company || '',
    job_title: u.job_title || '',
    experience_years: u.experience_years ?? null,
    skills: u.skills || [],
    linkedin: u.linkedin || '',
    branch: u.branch || u.dept || '',
    degree: u.degree || '',
    graduation_year: u.graduation_year || '',
    open_to_referral: !!u.open_to_referral,
    open_to_mentorship: u.open_to_mentorship !== false,
  };
}

// ── GET /api/alumni.php ────────────────────────────────────────
// Query params: q, company, branch, year, referral=1, mentorship=1
router.get('/', requireAuth(), async (req, res) => {
  try {
    const { q, company, branch, year } = req.query;
    const filter = { role: 'admin', status: 'active' };

    if (company) filter.company = new RegExp(esc(company), 'i');
    if (branch)  filter.$or = [{ branch: new RegExp(esc(branch), 'i') }, { dept: new RegExp(esc(branch), 'i') }];
    if (year)    filter.graduation_year = String(year);
    if (req.query.referral   === '1') filter.open_to_referral = true;
    if (req.query.mentorship === '1') filter.open_to_mentorship = { $ne: false };

    if (q) {
      const rx = new RegExp(esc(q), 'i');
      filter.$and = [{ $or: [{ name: rx }, { company: rx }, { job_title: rx }, { skills: rx }, { position: rx }] }];
    }

    const alumni = await User.find(filter).sort({ name: 1 }).lean();

    const cards = await Promise.all(alumni.map(async (a) => {
      const [openSlots, shared] = await Promise.all([
        MentorSlot.countDocuments({ alumni: a._id, status: 'open', start_at: { $gt: new Date() } }),
        InterviewExperience.countDocuments({ author: a._id }),
      ]);
      return { ...publicCard(a), open_slots: openSlots, experiences: shared };
    }));

    const companies = [...new Set(alumni.map((a) => a.company).filter(Boolean))].sort();

    return jsonOk(res, { alumni: cards, companies });
  } catch (err) {
    console.error('Alumni list error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load alumni directory.' });
  }
});

// ── GET /api/alumni.php/:id ────────────────────────────────────
router.get('/:id', requireAuth(), async (req, res) => {
  try {
    const a = await User.findOne({ _id: req.params.id, role: 'admin', status: 'active' }).lean();
    if (!a) return jsonErr(res, 'Alumni not found.', 404);

    const [slots, experiences] = await Promise.all([
      MentorSlot.find({ alumni: a._id, status: 'open', start_at: { $gt: new Date() } }).sort({ start_at: 1 }).lean(),
      InterviewExperience.find({ author: a._id }).sort({ created_at: -1 }).limit(5).lean(),
    ]);

    return jsonOk(res, {
      alumni: publicCard(a),
      slots: slots.map((s) => ({
        id: s._id, kind: s.kind, topic: s.topic, company: s.company,
        start_at: s.start_at, duration: s.duration,
      })),
      experiences: experiences.map((e) => ({ id: e._id, company: e.company, role: e.role, result: e.result })),
    });
  } catch (err) {
    console.error('Alumni detail error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load alumni profile.' });
  }
});

module.exports = router;
module.exports.publicCard = publicCard;
