// routes/saveResult.js — POST /api/save_result.php — Save exam result after submit
const express = require('express');
const router = express.Router();

const ExamResult = require('../models/ExamResult');
const CompletedRound = require('../models/CompletedRound');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

router.post('/', requireAuth('student'), async (req, res) => {
  try {
    const user = req.user;
    const body = req.body || {};

    const company = String(body.company || '').trim();
    const round = String(body.round || '').trim();
    const score = Number(body.score) || 0;
    const totalQ = Number(body.total_q) || 0;
    const correctQ = Number(body.correct_q) || 0;
    const passed = body.passed !== undefined ? Boolean(body.passed) : score >= 50;

    if (!company) return jsonErr(res, 'Company is required');
    if (!round) return jsonErr(res, 'Round is required');

    await ExamResult.create({
      user_id: user._id,
      company,
      round,
      score,
      total_q: totalQ,
      correct_q: correctQ,
      passed,
    });

    try {
      await CompletedRound.create({ user_id: user._id, company, round });
    } catch (e) {
      if (e.code !== 11000) throw e;
    }

    return jsonOk(res, { message: 'Result saved successfully', score, passed });
  } catch (err) {
    console.error('Save result error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save exam result.' });
  }
});

module.exports = router;
