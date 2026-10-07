// routes/adminManage.js — GET (list admins) / POST (create admin), holder-only
// Replaces api/admin_manage.php
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/User');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/', requireAuth('holder'), async (req, res) => {
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
});

// GET /api/admin_manage.php/pending — alumni who self-registered and are
// waiting for a holder to approve them. This is how the holder is
// "notified": the pending queue is polled from the Alumni Management page.
router.get('/pending', requireAuth('holder'), async (req, res) => {
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
});

// POST /api/admin_manage.php/:id/approve — holder confirms the alumni
// registration. Only after this does the account become active and able
// to log in.
router.post('/:id/approve', requireAuth('holder'), async (req, res) => {
  const admin = await User.findOne({ _id: req.params.id, role: 'admin', status: 'pending' });
  if (!admin) return jsonErr(res, 'Pending alumni request not found', 404);

  admin.status = 'active';
  await admin.save();

  return jsonOk(res, { message: `${admin.name} has been approved and can now sign in.` });
});

// POST /api/admin_manage.php/:id/reject — holder declines the request.
// The pending record is removed so the person is free to re-apply later.
router.post('/:id/reject', requireAuth('holder'), async (req, res) => {
  const admin = await User.findOne({ _id: req.params.id, role: 'admin', status: 'pending' });
  if (!admin) return jsonErr(res, 'Pending alumni request not found', 404);

  await User.deleteOne({ _id: admin._id });

  return jsonOk(res, { message: `${admin.name}'s alumni request has been declined.` });
});

router.post('/', requireAuth('holder'), async (req, res) => {
  const body = req.body || {};
  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const pass = (body.password || '').trim();
  const dept = (body.dept || 'Training & Placement').trim();
  const college = (body.college || '').trim();

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
    roll_no: rollNo,
    branch: 'Administration',
    dept,
    college,
  });

  return jsonOk(res, { message: 'Admin created successfully', id: admin._id });
});

module.exports = router;
