// routes/register.js — POST /api/register.php — Student (or admin) registration
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/User');
const Session = require('../models/Session');
const { jsonOk, jsonErr, generateToken, sessionExpiry } = require('../middleware/helpers');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLLEGE_EMAIL_DOMAIN = 'kongu.edu';
const isCollegeEmail = (e) => e.endsWith('@' + COLLEGE_EMAIL_DOMAIN) || e.endsWith('.' + COLLEGE_EMAIL_DOMAIN);
const ROLL_RE = /^[A-Za-z0-9\/-]{6,20}$/;
const ALUMNI_ROLES = ['Placement Coordinator', 'Alumni Mentor', 'Guest Lecturer', 'Training & Placement Officer', 'Entrepreneurship', 'Higher Studies / Research'];

router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();
    const rollNo = String(body.roll_no || '').trim();
    const branch = String(body.branch || 'Computer Science').trim();
    const cgpa = body.cgpa !== undefined && body.cgpa !== '' ? Number(body.cgpa) : null;
    const role = body.role === 'admin' ? 'admin' : 'student';
    const dept = String(body.dept || '').trim();
    const college = String(body.college || '').trim();
    const section = String(body.section || '').trim();
    const year = String(body.year || '').trim();
    const position = String(body.position || '').trim();
    const graduationYear = String(body.graduation_year || '').trim();
    const degree = String(body.degree || '').trim();

    if (!name) return jsonErr(res, 'Name is required');
    if (!email) return jsonErr(res, 'Email is required');
    if (!EMAIL_RE.test(email)) return jsonErr(res, 'Invalid email address');
    if (!password) return jsonErr(res, 'Password is required');
    if (password.length < 6) return jsonErr(res, 'Password must be at least 6 characters');
    if (role === 'student' && !rollNo) return jsonErr(res, 'Roll number is required');

    if (role === 'admin') {
      if (!ALUMNI_ROLES.includes(position)) {
        return jsonErr(res, 'Please select the role you will play as an alumni');
      }
      if (!isCollegeEmail(email)) {
        return jsonErr(res, `Alumni registration is restricted to official college e-mail addresses ending with @${COLLEGE_EMAIL_DOMAIN}`);
      }
      if (!ROLL_RE.test(rollNo)) {
        return jsonErr(res, 'Please enter your college register / roll number as printed on your records');
      }
      const gy = Number(graduationYear);
      const thisYear = new Date().getFullYear();
      if (!/^\d{4}$/.test(graduationYear) || gy < 1980 || gy > thisYear) {
        return jsonErr(res, `Please enter a valid year of graduation between 1980 and ${thisYear}`);
      }
      if (!degree) return jsonErr(res, 'Please enter your degree / branch (e.g. B.E. CSE)');
      if (!dept) return jsonErr(res, 'Please enter the department you graduated from');
    }

    const existing = await User.findOne({ email });
    if (existing) return jsonErr(res, 'Email is already registered');

    const hash = await bcrypt.hash(password, 10);

    // Alumni self-registration starts as pending until website holder approves.
    // Students become active immediately.
    const status = role === 'admin' ? 'pending' : 'active';

    const user = await User.create({
      name,
      email,
      password_hash: hash,
      role,
      status,
      roll_no: rollNo,
      branch,
      cgpa,
      dept,
      position: role === 'admin' ? position : '',
      college,
      section,
      year,
      graduation_year: role === 'admin' ? graduationYear : '',
      degree: role === 'admin' ? degree : '',
      college_email_verified: role === 'admin' ? isCollegeEmail(email) : false,
    });

    if (status === 'pending') {
      return jsonOk(res, {
        pending: true,
        message: 'Your alumni registration has been submitted and is awaiting admin approval. You will be able to sign in once approved.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          position: user.position,
          graduation_year: user.graduation_year,
          degree: user.degree,
        },
      });
    }

    const token = generateToken();
    await Session.create({ user_id: user._id, token, expires_at: sessionExpiry() });

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
        phone: user.phone || '',
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
});

module.exports = router;
