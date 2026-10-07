// routes/experiences.js — /api/experiences.php
// Company-wise interview experience feed: alumni (and placed students) post
// round-by-round breakdowns; everyone can upvote and comment.
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const InterviewExperience = require('../models/InterviewExperience');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

function esc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

async function hydrate(list, meId) {
  const ids = [...new Set(list.flatMap((e) => [String(e.author), ...e.comments.map((c) => String(c.user))]))];
  const users = await User.find({ _id: { $in: ids } }).select('name role avatar company job_title graduation_year').lean();
  const map = Object.fromEntries(users.map((u) => [String(u._id), u]));

  return list.map((e) => {
    const a = map[String(e.author)] || {};
    return {
      id: e._id,
      company: e.company,
      role: e.role,
      year: e.year,
      ctc: e.ctc,
      result: e.result,
      difficulty: e.difficulty,
      rounds: e.rounds,
      tips: e.tips,
      upvotes: e.upvotes.length,
      upvoted: e.upvotes.some((u) => String(u) === String(meId)),
      mine: String(e.author) === String(meId),
      created_at: e.created_at,
      author: { id: e.author, name: a.name || 'Unknown', role: a.role || '', avatar: a.avatar || '', company: a.company || '', job_title: a.job_title || '', graduation_year: a.graduation_year || '' },
      comments: e.comments.map((c) => ({
        id: c._id,
        text: c.text,
        created_at: c.created_at,
        author: { id: c.user, name: (map[String(c.user)] || {}).name || 'Unknown', role: (map[String(c.user)] || {}).role || '' },
      })),
    };
  });
}

// ── GET /api/experiences.php ───────────────────────────────────
router.get('/', requireAuth(), async (req, res) => {
  const filter = {};
  if (req.query.company) filter.company = new RegExp(esc(req.query.company), 'i');
  if (req.query.q) {
    const rx = new RegExp(esc(req.query.q), 'i');
    filter.$or = [{ company: rx }, { role: rx }, { tips: rx }];
  }
  if (req.query.mine === '1') filter.author = req.user._id;

  const sort = req.query.sort === 'top' ? { created_at: -1 } : { created_at: -1 };
  const rows = await InterviewExperience.find(filter).sort(sort).limit(100).lean();
  let list = await hydrate(rows, req.user._id);
  if (req.query.sort === 'top') list = list.sort((a, b) => b.upvotes - a.upvotes);

  const companies = [...new Set(rows.map((r) => r.company))].sort();
  return jsonOk(res, { experiences: list, companies });
});

// ── POST /api/experiences.php ──────────────────────────────────
router.post('/', requireAuth(), async (req, res) => {
  const b = req.body || {};
  if (!b.company || !String(b.company).trim()) return jsonErr(res, 'Company is required.');

  const rounds = Array.isArray(b.rounds)
    ? b.rounds.filter((r) => r && r.name).map((r) => ({ name: String(r.name).trim(), details: String(r.details || '').slice(0, 2000) }))
    : [];

  const doc = await InterviewExperience.create({
    author: req.user._id,
    company: String(b.company).trim(),
    role: String(b.role || '').trim(),
    year: String(b.year || '').trim(),
    ctc: String(b.ctc || '').trim(),
    result: ['selected', 'rejected', 'in-process'].includes(b.result) ? b.result : 'selected',
    difficulty: ['Easy', 'Medium', 'Hard', 'Very Hard'].includes(b.difficulty) ? b.difficulty : 'Medium',
    rounds,
    tips: String(b.tips || '').slice(0, 3000),
  });

  return jsonOk(res, { message: 'Experience shared', id: doc._id });
});

// ── POST /api/experiences.php/:id/upvote ───────────────────────
router.post('/:id/upvote', requireAuth(), async (req, res) => {
  const doc = await InterviewExperience.findById(req.params.id);
  if (!doc) return jsonErr(res, 'Experience not found.', 404);
  const i = doc.upvotes.findIndex((u) => String(u) === String(req.user._id));
  if (i >= 0) doc.upvotes.splice(i, 1); else doc.upvotes.push(req.user._id);
  await doc.save();
  return jsonOk(res, { upvotes: doc.upvotes.length, upvoted: i < 0 });
});

// ── POST /api/experiences.php/:id/comment ──────────────────────
router.post('/:id/comment', requireAuth(), async (req, res) => {
  const text = String((req.body || {}).text || '').trim();
  if (!text) return jsonErr(res, 'Comment cannot be empty.');
  const doc = await InterviewExperience.findById(req.params.id);
  if (!doc) return jsonErr(res, 'Experience not found.', 404);
  doc.comments.push({ user: req.user._id, text: text.slice(0, 800) });
  await doc.save();
  return jsonOk(res, { message: 'Comment added' });
});

// ── DELETE /api/experiences.php/:id ────────────────────────────
router.delete('/:id', requireAuth(), async (req, res) => {
  const doc = await InterviewExperience.findById(req.params.id);
  if (!doc) return jsonErr(res, 'Experience not found.', 404);
  if (String(doc.author) !== String(req.user._id) && req.user.role !== 'holder') {
    return jsonErr(res, 'Access denied.', 403);
  }
  await doc.deleteOne();
  return jsonOk(res, { message: 'Experience deleted' });
});

module.exports = router;
