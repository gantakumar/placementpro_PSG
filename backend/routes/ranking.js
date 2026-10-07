// routes/ranking.js — GET /api/ranking.php — Student performance ranking (leaderboard)
// Divides all students into 4 performance tiers based on average exam score,
// mirroring the "360 students ÷ 4 = 90 per tier" idea from the design sketch.
// Visible to the Alumni portal (role: admin) and the top Admin portal (role: holder).
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const ExamResult = require('../models/ExamResult');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

const TIERS = [
  { key: 'high',   label: 'High Score',        short: 'Top 25%',    emoji: '🥇', badge: 'badge-gn' },
  { key: 'second',  label: 'Second High Score', short: '25–50%',     emoji: '🥈', badge: 'badge-cy' },
  { key: 'third',   label: 'Third High Score',  short: '50–75%',     emoji: '🥉', badge: 'badge-gd' },
  { key: 'low',     label: 'Fourth Score (Low)', short: 'Bottom 25%', emoji: '📊', badge: 'badge-rd' },
];

router.get('/', requireAuth(), async (req, res) => {
  if (!['admin', 'holder'].includes(req.user.role)) return jsonErr(res, 'Forbidden', 403);

  const { branch, section, year } = req.query;
  const filter = { role: 'student' };
  if (branch) filter.branch = new RegExp(`^${branch}$`, 'i');
  if (section) filter.section = new RegExp(`^${section}$`, 'i');
  if (year) filter.year = year;

  const students = await User.find(filter).lean();

  const withScores = await Promise.all(students.map(async (s) => {
    const rows = await ExamResult.find({ user_id: s._id }).sort({ taken_at: -1 });
    const latest = {};
    rows.forEach((row) => {
      const key = `${row.company}_${row.round}`;
      if (!(key in latest)) latest[key] = row.score;
    });
    const tests = Object.keys(latest).length;
    const avg = tests ? Math.round(Object.values(latest).reduce((a, b) => a + b, 0) / tests) : 0;
    return {
      id: s._id,
      name: s.name,
      email: s.email,
      roll_no: s.roll_no || '',
      branch: s.branch || '',
      section: s.section || '',
      year: s.year || '',
      cgpa: s.cgpa,
      tests,
      avg_score: avg,
    };
  }));

  const ranked = withScores.filter((s) => s.tests > 0).sort((a, b) => b.avg_score - a.avg_score);
  const notAttempted = withScores.filter((s) => s.tests === 0);

  const n = ranked.length;
  const quarter = n / 4;
  const ranking = ranked.map((s, i) => {
    const tierIdx = n === 0 ? 0 : Math.min(3, Math.floor(i / (quarter || 1)));
    return { ...s, rank: i + 1, tier: TIERS[tierIdx].key, tier_label: TIERS[tierIdx].label, tier_emoji: TIERS[tierIdx].emoji, tier_badge: TIERS[tierIdx].badge };
  });

  const tierCounts = TIERS.map((t) => ({ ...t, count: ranking.filter((r) => r.tier === t.key).length }));

  return jsonOk(res, {
    total: n,
    not_attempted: notAttempted.length,
    tiers: tierCounts,
    ranking,
    unranked: notAttempted,
  });
});

module.exports = router;
