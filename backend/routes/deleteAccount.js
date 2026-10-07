// routes/deleteAccount.js — POST /api/delete_account.php — Permanently delete account
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Session = require('../models/Session');
const ExamResult = require('../models/ExamResult');
const CompletedRound = require('../models/CompletedRound');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

router.post('/', requireAuth('student'), async (req, res) => {
  const user = req.user;

  // Manually cascade-delete related documents (Mongo has no FK ON DELETE CASCADE)
  await Promise.all([
    ExamResult.deleteMany({ user_id: user._id }),
    CompletedRound.deleteMany({ user_id: user._id }),
    Session.deleteMany({ user_id: user._id }),
  ]);

  const result = await User.deleteOne({ _id: user._id, role: 'student' });
  if (result.deletedCount === 0) return jsonErr(res, 'Account not found or already deleted');

  return jsonOk(res, { message: 'Account and all associated data permanently deleted' });
});

module.exports = router;
