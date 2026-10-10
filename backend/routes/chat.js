// routes/chat.js — GET/POST /api/chat.php — Direct messaging between
// Students and Alumni (role: admin). Simple polling-based chat.
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

const ONLINE_WINDOW_MS = 70 * 1000;
function isOnline(lastSeen) {
  return !!lastSeen && (Date.now() - new Date(lastSeen).getTime()) < ONLINE_WINDOW_MS;
}

function counterpartRole(role) {
  if (role === 'student') return 'admin';
  if (role === 'admin') return 'student';
  // Holders can view/message both sides
  if (role === 'holder') return null; // handled separately
  return null;
}

// ── GET /api/chat.php/contacts ──────────────────────────────────
router.get('/contacts', requireAuth(), async (req, res) => {
  try {
    const role = counterpartRole(req.user.role);
    if (!role && req.user.role !== 'holder') {
      return jsonErr(res, 'Chat is only available to students and alumni.', 403);
    }

    // For holders, show all alumni (admins)
    const searchRole = req.user.role === 'holder' ? 'admin' : role;
    const people = await User.find({ role: searchRole }).select('name email branch dept roll_no last_seen').lean();

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
  } catch (err) {
    console.error('Chat contacts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load contacts.' });
  }
});

// ── GET /api/chat.php/unread-count ──────────────────────────────
router.get('/unread-count', requireAuth(), async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({ to: req.user._id, read: false });
    return jsonOk(res, { count });
  } catch (err) {
    console.error('Unread count error:', err);
    return res.status(500).json({ success: false, message: 'Failed to get unread count.' });
  }
});

// ── GET /api/chat.php/thread/:userId ────────────────────────────
router.get('/thread/:userId', requireAuth(), async (req, res) => {
  try {
    const role = counterpartRole(req.user.role);

    const other = await User.findById(req.params.userId).select('name email role branch dept last_seen').lean();
    if (!other) return jsonErr(res, 'Contact not found.', 404);

    // Students can only chat with admins and vice versa; holders see all
    if (req.user.role !== 'holder' && role && other.role !== role) {
      return jsonErr(res, 'You can only message alumni (or students if you are alumni).', 403);
    }

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
  } catch (err) {
    console.error('Chat thread error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load conversation.' });
  }
});

// ── POST /api/chat.php/send ─────────────────────────────────────
router.post('/send', requireAuth(), async (req, res) => {
  try {
    const role = counterpartRole(req.user.role);
    const { to, text } = req.body || {};

    if (!to)            return jsonErr(res, 'Recipient is required.');
    if (!text || !String(text).trim()) return jsonErr(res, 'Message text is required.');

    const other = await User.findById(to).select('role').lean();
    if (!other) return jsonErr(res, 'Contact not found.', 404);

    // Role check for students & alumni only
    if (req.user.role !== 'holder' && role && other.role !== role) {
      return jsonErr(res, 'You can only message alumni (or students if you are alumni).', 403);
    }

    const msg = await ChatMessage.create({ from: req.user._id, to, text: String(text).trim() });

    return jsonOk(res, {
      message: { id: msg._id, from_me: true, text: msg.text, created_at: msg.created_at },
    });
  } catch (err) {
    console.error('Chat send error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// ── POST /api/chat.php/presence/ping ────────────────────────────
router.post('/presence/ping', requireAuth(), async (req, res) => {
  try {
    return jsonOk(res, { online: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Ping failed.' });
  }
});

module.exports = router;
