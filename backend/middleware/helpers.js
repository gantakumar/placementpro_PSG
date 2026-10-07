// middleware/helpers.js — shared utilities (replaces config/helpers.php)
const crypto = require('crypto');
const Session = require('../models/Session');
const User = require('../models/User');

function jsonOk(res, data = {}) {
  return res.json({ success: true, ...data });
}

function jsonErr(res, message, code = 400) {
  return res.status(code).json({ success: false, message });
}

function getTokenFromRequest(req) {
  const xToken = req.headers['x-token'];
  if (xToken) return String(xToken).trim();
  const auth = req.headers['authorization'];
  if (auth) return String(auth).replace('Bearer', '').trim();
  return null;
}

// Express middleware factory — mirrors requireAuth($requiredRole) from PHP.
// Usage: requireAuth() for any logged-in user, requireAuth('student') to restrict role.
function requireAuth(requiredRole = null) {
  return async function (req, res, next) {
    const token = getTokenFromRequest(req);
    if (!token) return jsonErr(res, 'Not logged in. Please sign in again.', 401);

    const session = await Session.findOne({ token, expires_at: { $gt: new Date() } });
    if (!session) return jsonErr(res, 'Session expired. Please sign in again.', 401);

    const user = await User.findById(session.user_id);
    if (!user) return jsonErr(res, 'Session expired. Please sign in again.', 401);

    if (requiredRole && user.role !== requiredRole) {
      return jsonErr(res, 'Access denied.', 403);
    }

    // Presence: remember that this user was just active. Fire-and-forget so
    // it never slows the request down.
    User.updateOne({ _id: user._id }, { last_seen: new Date() }).catch(() => {});

    req.user = user;
    next();
  };
}

function generateToken() {
  return crypto.randomBytes(48).toString('hex');
}

function sessionExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 7); // +7 days, same as PHP version
  return d;
}

module.exports = { jsonOk, jsonErr, getTokenFromRequest, requireAuth, generateToken, sessionExpiry };
