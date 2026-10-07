// routes/forum.js — /api/forum.php — Public Q&A forum between students & alumni.
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const ForumQuestion = require('../models/ForumQuestion');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

function esc(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

async function hydrate(rows, meId) {
  const ids = [...new Set(rows.flatMap((q) => [String(q.author), ...q.answers.map((a) => String(a.author))]))];
  const users = await User.find({ _id: { $in: ids } }).select('name role avatar company job_title branch dept').lean();
  const map = Object.fromEntries(users.map((u) => [String(u._id), u]));
  const who = (id) => {
    const u = map[String(id)] || {};
    return { id, name: u.name || 'Unknown', role: u.role || '', avatar: u.avatar || '', company: u.company || '', job_title: u.job_title || '' };
  };

  return rows.map((q) => ({
    id: q._id,
    title: q.title,
    body: q.body,
    company: q.company,
    tags: q.tags,
    solved: q.solved,
    created_at: q.created_at,
    mine: String(q.author) === String(meId),
    upvotes: q.upvotes.length,
    upvoted: q.upvotes.some((u) => String(u) === String(meId)),
    author: who(q.author),
    answers: q.answers
      .map((a) => ({
        id: a._id,
        text: a.text,
        accepted: a.accepted,
        created_at: a.created_at,
        upvotes: a.upvotes.length,
        upvoted: a.upvotes.some((u) => String(u) === String(meId)),
        author: who(a.author),
      }))
      .sort((a, b) => Number(b.accepted) - Number(a.accepted) || b.upvotes - a.upvotes),
  }));
}

// ── GET /api/forum.php ─────────────────────────────────────────
router.get('/', requireAuth(), async (req, res) => {
  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(esc(req.query.q), 'i');
    filter.$or = [{ title: rx }, { body: rx }, { company: rx }, { tags: rx }];
  }
  if (req.query.unanswered === '1') filter.answers = { $size: 0 };
  if (req.query.mine === '1') filter.author = req.user._id;

  const rows = await ForumQuestion.find(filter).sort({ created_at: -1 }).limit(100).lean();
  return jsonOk(res, { questions: await hydrate(rows, req.user._id) });
});

// ── POST /api/forum.php — ask a question ───────────────────────
router.post('/', requireAuth(), async (req, res) => {
  const b = req.body || {};
  const title = String(b.title || '').trim();
  if (!title) return jsonErr(res, 'Question title is required.');

  const doc = await ForumQuestion.create({
    author: req.user._id,
    title: title.slice(0, 200),
    body: String(b.body || '').slice(0, 4000),
    company: String(b.company || '').trim(),
    tags: Array.isArray(b.tags) ? b.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 6) : [],
  });

  return jsonOk(res, { message: 'Question posted', id: doc._id });
});

// ── POST /api/forum.php/:id/answer ─────────────────────────────
router.post('/:id/answer', requireAuth(), async (req, res) => {
  const text = String((req.body || {}).text || '').trim();
  if (!text) return jsonErr(res, 'Answer cannot be empty.');
  const q = await ForumQuestion.findById(req.params.id);
  if (!q) return jsonErr(res, 'Question not found.', 404);
  q.answers.push({ author: req.user._id, text: text.slice(0, 4000) });
  await q.save();
  return jsonOk(res, { message: 'Answer posted' });
});

// ── POST /api/forum.php/:id/upvote ─────────────────────────────
router.post('/:id/upvote', requireAuth(), async (req, res) => {
  const q = await ForumQuestion.findById(req.params.id);
  if (!q) return jsonErr(res, 'Question not found.', 404);
  const i = q.upvotes.findIndex((u) => String(u) === String(req.user._id));
  if (i >= 0) q.upvotes.splice(i, 1); else q.upvotes.push(req.user._id);
  await q.save();
  return jsonOk(res, { upvotes: q.upvotes.length, upvoted: i < 0 });
});

// ── POST /api/forum.php/:id/answer/:answerId/upvote ────────────
router.post('/:id/answer/:answerId/upvote', requireAuth(), async (req, res) => {
  const q = await ForumQuestion.findById(req.params.id);
  if (!q) return jsonErr(res, 'Question not found.', 404);
  const a = q.answers.id(req.params.answerId);
  if (!a) return jsonErr(res, 'Answer not found.', 404);
  const i = a.upvotes.findIndex((u) => String(u) === String(req.user._id));
  if (i >= 0) a.upvotes.splice(i, 1); else a.upvotes.push(req.user._id);
  await q.save();
  return jsonOk(res, { upvotes: a.upvotes.length, upvoted: i < 0 });
});

// ── POST /api/forum.php/:id/answer/:answerId/accept — asker only ─
router.post('/:id/answer/:answerId/accept', requireAuth(), async (req, res) => {
  const q = await ForumQuestion.findById(req.params.id);
  if (!q) return jsonErr(res, 'Question not found.', 404);
  if (String(q.author) !== String(req.user._id)) return jsonErr(res, 'Only the person who asked can accept an answer.', 403);
  const a = q.answers.id(req.params.answerId);
  if (!a) return jsonErr(res, 'Answer not found.', 404);
  q.answers.forEach((x) => { x.accepted = false; });
  a.accepted = true;
  q.solved = true;
  await q.save();
  return jsonOk(res, { message: 'Answer accepted' });
});

// ── DELETE /api/forum.php/:id ──────────────────────────────────
router.delete('/:id', requireAuth(), async (req, res) => {
  const q = await ForumQuestion.findById(req.params.id);
  if (!q) return jsonErr(res, 'Question not found.', 404);
  if (String(q.author) !== String(req.user._id) && req.user.role !== 'holder') return jsonErr(res, 'Access denied.', 403);
  await q.deleteOne();
  return jsonOk(res, { message: 'Question deleted' });
});

module.exports = router;
