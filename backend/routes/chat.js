// routes/chat.js — GET/POST /api/chat.php — Direct messaging between
// Students and Alumni (role: admin). Simple polling-based chat: no
// websockets, the frontend polls the thread every few seconds.
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

// Students may only chat with Alumni (admin) and vice versa.
// A user is considered online when they were active in the last 70 seconds
// (clients heartbeat every 30s and poll chat every few seconds).
const ONLINE_WINDOW_MS = 70 * 1000;
function isOnline(lastSeen) {
  return !!lastSeen && (Date.now() - new Date(lastSeen).getTime()) < ONLINE_WINDOW_MS;
}

function counterpartRole(role) {
  if (role === 'student') return 'admin';
  if (role === 'admin') return 'student';
  return null;
}

// ── GET /api/chat.php/contacts ──────────────────────────────────
// List of people this user is allowed to chat with, each annotated
// with their last message + unread count so the contact list can
// render previews without extra requests.
router.get('/contacts', requireAuth(), async (req, res) => {
  const role = counterpartRole(req.user.role);
  if (!role) return jsonErr(res, 'Chat is only available to students and alumni.', 403);

  const people = await User.find({ role }).select('name email branch dept roll_no last_seen').lean();

  const contacts = await Promise.all(people.map(async (p) => {
    const last = await ChatMessage.findOne({
      $or: [
        { from: req.user._id, to: p._id },
        { from: p._id, to: req.user._id },
      ],
    }).sort({ created_at: -1 }).lean();

    const unread = await ChatMessage.countDocuments({ from: p._id, to: req.user._id, read: false });

    return {
      id: p._id,
      name: p.name,
      email: p.email,
      branch: p.branch || p.dept || '',
      roll_no: p.roll_no || '',
      last_message: last ? last.text : '',
      last_at: last ? last.created_at : null,
      unread,
      online: isOnline(p.last_seen),
      last_seen: p.last_seen || null,
    };
  }));

  contacts.sort((a, b) => new Date(b.last_at || 0) - new Date(a.last_at || 0));

  return jsonOk(res, { contacts });
});

// ── GET /api/chat.php/unread-count ──────────────────────────────
router.get('/unread-count', requireAuth(), async (req, res) => {
  const count = await ChatMessage.countDocuments({ to: req.user._id, read: false });
  return jsonOk(res, { count });
});

// ── GET /api/chat.php/thread/:userId ────────────────────────────
// Full conversation with one contact. Marks their messages as read.
router.get('/thread/:userId', requireAuth(), async (req, res) => {
  const role = counterpartRole(req.user.role);
  if (!role) return jsonErr(res, 'Chat is only available to students and alumni.', 403);

  const other = await User.findById(req.params.userId).select('name email role branch dept last_seen').lean();
  if (!other || other.role !== role) return jsonErr(res, 'Contact not found.', 404);

  const messages = await ChatMessage.find({
    $or: [
      { from: req.user._id, to: other._id },
      { from: other._id, to: req.user._id },
    ],
  }).sort({ created_at: 1 }).lean();

  await ChatMessage.updateMany({ from: other._id, to: req.user._id, read: false }, { read: true });

  return jsonOk(res, {
    contact: {
      id: other._id,
      name: other.name,
      email: other.email,
      branch: other.branch || other.dept || '',
      online: isOnline(other.last_seen),
      last_seen: other.last_seen || null,
    },
    messages: messages.map((m) => ({
      id: m._id,
      from_me: String(m.from) === String(req.user._id),
      text: m.text,
      created_at: m.created_at,
    })),
  });
});

// ── POST /api/chat.php/send ─────────────────────────────────────
router.post('/send', requireAuth(), async (req, res) => {
  const role = counterpartRole(req.user.role);
  if (!role) return jsonErr(res, 'Chat is only available to students and alumni.', 403);

  const { to, text } = req.body;
  if (!to || !text || !text.trim()) return jsonErr(res, 'Message text is required.');

  const other = await User.findById(to).select('role').lean();
  if (!other || other.role !== role) return jsonErr(res, 'Contact not found.', 404);

  const msg = await ChatMessage.create({ from: req.user._id, to, text: text.trim() });

  return jsonOk(res, {
    message: { id: msg._id, from_me: true, text: msg.text, created_at: msg.created_at },
  });
});

// ── POST /api/chat.php/presence/ping ────────────────────────────
// Client heartbeat. requireAuth() already refreshes last_seen, so the
// handler only has to confirm the user's own status back.
router.post('/presence/ping', requireAuth(), async (req, res) => {
  return jsonOk(res, { online: true });
});

module.exports = router;
