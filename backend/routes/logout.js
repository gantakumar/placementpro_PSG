// routes/logout.js — POST /api/logout.php — Destroy session (replaces api/logout.php)
const express = require('express');
const router = express.Router();

const Session = require('../models/Session');
const { jsonOk, getTokenFromRequest } = require('../middleware/helpers');

router.post('/', async (req, res) => {
  const token = getTokenFromRequest(req);
  if (token) await Session.deleteOne({ token });
  return jsonOk(res, { message: 'Logged out successfully' });
});

module.exports = router;
