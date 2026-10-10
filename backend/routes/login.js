// routes/login.js — POST /api/login.php — Login for all roles
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/User');
const Session = require('../models/Session');
const ExamResult = require('../models/ExamResult');
const CompletedRound = require('../models/CompletedRound');
const { jsonOk, jsonErr, generateToken, sessionExpiry } = require('../middleware/helpers');

router.post('/', async (req, res) => {
  try {
    // Safely read body — guard against undefined (should not happen with express.json,
    // but defensive coding prevents the TypeError logged in Vercel)
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return jsonErr(res, 'Request body is missing or not valid JSON');
    }

    const email  = String(body.email    || '').trim().toLowerCase();
    const pass   = String(body.password || '').trim();
    const portal = String(body.portal   || 'student').trim();

    if (!email) return jsonErr(res, 'Email is required');
    if (!pass)  return jsonErr(res, 'Password is required');

    const user = await User.findOne({ email });
    if (!user) return jsonErr(res, 'Invalid email or password');

    const match = await bcrypt.compare(pass, user.password_hash);
    if (!match) return jsonErr(res, 'Invalid email or password');

    // ── Portal ↔ role checks ────────────────────────────────────────
    if (portal === 'student' && user.role !== 'student') {
      return jsonErr(res, 'This account does not belong to the Student Portal. Please use the correct portal.');
    }
    if (portal === 'admin' && user.role !== 'admin') {
      return jsonErr(res, 'This account does not belong to the Alumni Portal. Please use the correct portal.');
    }
    if (portal === 'holder' && user.role !== 'holder') {
      return jsonErr(res, 'This account does not belong to the Admin (Website Holder) Portal. Please use the correct portal.');
    }

    // ── Alumni approval workflow ─────────────────────────────────────
    if (user.role === 'admin' && user.status === 'pending') {
      return jsonErr(res, 'Your alumni registration is awaiting admin approval. Please check back later.');
    }
    if (user.role === 'admin' && user.status === 'rejected') {
      return jsonErr(res, 'Your alumni registration was declined. Please contact the platform admin.');
    }

    // ── Invalidate old sessions ──────────────────────────────────────
    await Session.deleteMany({ user_id: user._id });

    const token = generateToken();
    await Session.create({ user_id: user._id, token, expires_at: sessionExpiry() });

    // ── Fetch extra student data ─────────────────────────────────────
    let completedRounds = {};
    let scores = {};

    if (user.role === 'student') {
      const crRows = await CompletedRound.find({ user_id: user._id });
      crRows.forEach((row) => {
        if (!completedRounds[row.company]) completedRounds[row.company] = [];
        completedRounds[row.company].push(row.round);
      });

      const scRows = await ExamResult.find({ user_id: user._id }).sort({ taken_at: -1 });
      scRows.forEach((row) => {
        const key = `${row.company}_${row.round}`;
        if (!(key in scores)) scores[key] = row.score;
      });
    }

    return jsonOk(res, {
      token,
      user: {
        id:              user._id,
        name:            user.name,
        email:           user.email,
        role:            user.role,
        roll_no:         user.roll_no,
        branch:          user.branch,
        cgpa:            user.cgpa,
        phone:           user.phone,
        dept:            user.dept,
        college:         user.college,
        section:         user.section,
        year:            user.year,
        avatar:          user.avatar,
        bio:             user.bio,
        company:         user.company  || '',
        job_title:       user.job_title || '',
        skills:          user.skills   || [],
        linkedin:        user.linkedin || '',
        open_to_mentorship: user.open_to_mentorship !== false,
        open_to_referral:   user.open_to_referral   !== false,
        completedRounds,
        scores,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login. Please try again.' });
  }
});

module.exports = router;
