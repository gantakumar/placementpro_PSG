// routes/adminManage.js — GET (list admins) / POST (create admin), holder-only
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/User');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/', requireAuth('holder'), async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin', status: 'active' }).sort({ created_at: -1 }).lean();
    const shaped = admins.map((a) => ({
      id: a._id,
      name: a.name,
      email: a.email,
      roll_no: a.roll_no,
      dept: a.dept,
      position: a.position,
      college: a.college,
      graduation_year: a.graduation_year,
      degree: a.degree,
      joinedAt: a.created_at,
      created_at: a.created_at,
    }));
    return jsonOk(res, { admins: shaped });
  } catch (err) {
    console.error('List admins error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load admins.' });
  }
});

// GET /api/admin_manage.php/pending — alumni who self-registered and are waiting for approval
router.get('/pending', requireAuth('holder'), async (req, res) => {
  try {
    const pending = await User.find({ role: 'admin', status: 'pending' }).sort({ created_at: -1 }).lean();
    const shaped = pending.map((a) => ({
      id: a._id,
      name: a.name,
      email: a.email,
      dept: a.dept,
      position: a.position,
      college: a.college,
      roll_no: a.roll_no,
      graduation_year: a.graduation_year,
      degree: a.degree,
      college_email_verified: a.college_email_verified,
      requestedAt: a.created_at,
    }));
    return jsonOk(res, { pending: shaped });
  } catch (err) {
    console.error('Pending alumni error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load pending alumni requests.' });
  }
});

// POST /api/admin_manage.php/:id/approve — holder confirms the alumni registration
router.post('/:id/approve', requireAuth('holder'), async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.params.id, role: 'admin', status: 'pending' });
    if (!admin) return jsonErr(res, 'Pending alumni request not found', 404);

    admin.status = 'active';
    await admin.save();

    return jsonOk(res, { message: `${admin.name} has been approved and can now sign in.` });
  } catch (err) {
    console.error('Approve alumni error:', err);
    return res.status(500).json({ success: false, message: 'Failed to approve alumni.' });
  }
});

// POST /api/admin_manage.php/:id/reject — holder declines the request
router.post('/:id/reject', requireAuth('holder'), async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.params.id, role: 'admin', status: 'pending' });
    if (!admin) return jsonErr(res, 'Pending alumni request not found', 404);

    await User.deleteOne({ _id: admin._id });

    return jsonOk(res, { message: `${admin.name}'s alumni request has been declined.` });
  } catch (err) {
    console.error('Reject alumni error:', err);
    return res.status(500).json({ success: false, message: 'Failed to decline alumni.' });
  }
});

router.post('/', requireAuth('holder'), async (req, res) => {
  try {
    const body = req.body || {};
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const pass = String(body.password || '').trim();
    const dept = String(body.dept || 'Training & Placement').trim();
    const college = String(body.college || '').trim();

    if (!name) return jsonErr(res, 'Name is required');
    if (!email) return jsonErr(res, 'Email is required');
    if (!EMAIL_RE.test(email)) return jsonErr(res, 'Invalid email');
    if (pass.length < 6) return jsonErr(res, 'Password must be at least 6 characters');

    const existing = await User.findOne({ email });
    if (existing) return jsonErr(res, 'Email already registered');

    const rollNo = 'ADM' + String(Date.now()).slice(-4);
    const hash = await bcrypt.hash(pass, 10);

    const admin = await User.create({
      name,
      email,
      password_hash: hash,
      role: 'admin',
      status: 'active',
      roll_no: rollNo,
      branch: 'Administration',
      dept,
      college,
    });

    return jsonOk(res, { message: 'Admin created successfully', id: admin._id });
  } catch (err) {
    console.error('Create admin error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create admin.' });
  }
});

module.exports = router;
