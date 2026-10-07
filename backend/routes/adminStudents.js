// routes/adminStudents.js — GET /api/admin_students.php — List all students + results
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const ExamResult = require('../models/ExamResult');
const CompletedRound = require('../models/CompletedRound');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

router.get('/', requireAuth(), async (req, res) => {
  if (!['admin', 'holder'].includes(req.user.role)) return jsonErr(res, 'Forbidden', 403);

  const students = await User.find({ role: 'student' }).sort({ created_at: -1 }).lean();

  for (const student of students) {
    const scRows = await ExamResult.find({ user_id: student._id }).sort({ taken_at: -1 });
    const scores = {};
    scRows.forEach((row) => {
      const key = `${row.company}_${row.round}`;
      if (!(key in scores)) {
        scores[key] = { score: row.score, passed: row.passed, taken_at: row.taken_at };
      }
    });
    student.scores = scores;

    const crRows = await CompletedRound.find({ user_id: student._id });
    const cr = {};
    crRows.forEach((row) => {
      if (!cr[row.company]) cr[row.company] = [];
      cr[row.company].push(row.round);
    });
    student.completedRounds = cr;
    student.id = student._id;
  }

  return jsonOk(res, { students });
});

module.exports = router;
