// routes/login.js — POST /api/login.php — Login for all roles (replaces api/login.php)
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/User');
const Session = require('../models/Session');
const ExamResult = require('../models/ExamResult');
const CompletedRound = require('../models/CompletedRound');
const { jsonOk, jsonErr, generateToken, sessionExpiry } = require('../middleware/helpers');

router.post('/', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const pass = (req.body.password || '').trim();
  const portal = (req.body.portal || 'student').trim();

  if (!email || !pass) return jsonErr(res, 'Email and password are required');

  const user = await User.findOne({ email });
  if (!user) return jsonErr(res, 'Invalid email or password');

  const match = await bcrypt.compare(pass, user.password_hash);
  if (!match) return jsonErr(res, 'Invalid email or password');

  if (user.role === 'admin' && user.status === 'pending') {
    return jsonErr(res, 'Your alumni registration is still awaiting admin approval. Please check back later.');
  }
  if (user.role === 'admin' && user.status === 'rejected') {
    return jsonErr(res, 'Your alumni registration request was declined. Please contact the platform admin.');
  }

  if (portal === 'student' && user.role !== 'student') {
    return jsonErr(res, 'This account does not belong to the Student Portal. Please use the correct portal.');
  }
  // Alumni Portal is reserved for official college (@kongu.edu) accounts.
  if (user.role === 'admin' && !(email.endsWith('@kongu.edu') || email.endsWith('.kongu.edu'))) {
    return jsonErr(res, 'The Alumni Portal is restricted to official @kongu.edu e-mail accounts.');
  }
  if (portal === 'admin' && user.role !== 'admin') {
    return jsonErr(res, 'This account does not belong to the Admin Portal. Please use the correct portal.');
  }
  if (portal === 'holder' && user.role !== 'holder') {
    return jsonErr(res, 'This account does not belong to the Website Holder Portal. Please use the correct portal.');
  }

  // Invalidate old sessions (keep only latest), same as PHP version
  await Session.deleteMany({ user_id: user._id });

  const token = generateToken();
  await Session.create({ user_id: user._id, token, expires_at: sessionExpiry() });

  // Completed rounds
  const crRows = await CompletedRound.find({ user_id: user._id });
  const completedRounds = {};
  crRows.forEach((row) => {
    if (!completedRounds[row.company]) completedRounds[row.company] = [];
    completedRounds[row.company].push(row.round);
  });

  // Latest score per company+round
  const scRows = await ExamResult.find({ user_id: user._id }).sort({ taken_at: -1 });
  const scores = {};
  scRows.forEach((row) => {
    const key = `${row.company}_${row.round}`;
    if (!(key in scores)) scores[key] = row.score;
  });

  return jsonOk(res, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roll_no: user.roll_no,
      branch: user.branch,
      cgpa: user.cgpa,
      phone: user.phone,
      dept: user.dept,
      college: user.college,
      section: user.section,
      year: user.year,
      avatar: user.avatar,
      bio: user.bio,
      completedRounds,
      scores,
    },
  });
});

module.exports = router;
