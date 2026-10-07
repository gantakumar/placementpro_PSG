// routes/adminResults.js — GET /api/admin_results.php — All exam results (admin view)
const express = require('express');
const router = express.Router();

const ExamResult = require('../models/ExamResult');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

router.get('/', requireAuth(), async (req, res) => {
  if (!['admin', 'holder'].includes(req.user.role)) return jsonErr(res, 'Forbidden', 403);

  const rows = await ExamResult.find().populate('user_id', 'name roll_no branch email').sort({ taken_at: -1 }).lean();

  const results = rows.map((r) => ({
    id: r._id,
    company: r.company,
    round: r.round,
    score: r.score,
    total_q: r.total_q,
    correct_q: r.correct_q,
    passed: r.passed,
    taken_at: r.taken_at,
    name: r.user_id ? r.user_id.name : '—',
    roll_no: r.user_id ? r.user_id.roll_no : '',
    branch: r.user_id ? r.user_id.branch : '',
    email: r.user_id ? r.user_id.email : '',
  }));

  return jsonOk(res, { results, total: results.length });
});

module.exports = router;
