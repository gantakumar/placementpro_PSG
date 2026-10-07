// routes/register.js — POST /api/register.php — Student (or admin) registration (replaces api/register.php)
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/User');
const Session = require('../models/Session');
const { jsonOk, jsonErr, generateToken, sessionExpiry } = require('../middleware/helpers');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Only official college e-mail addresses may register / use the Alumni Portal.
const COLLEGE_EMAIL_DOMAIN = 'kongu.edu';
const isCollegeEmail = (e) => e.endsWith('@' + COLLEGE_EMAIL_DOMAIN) || e.endsWith('.' + COLLEGE_EMAIL_DOMAIN);
const ROLL_RE = /^[A-Za-z0-9\/-]{6,20}$/;
const ALUMNI_ROLES = ['Placement Coordinator', 'Alumni Mentor', 'Guest Lecturer', 'Training & Placement Officer', 'Entrepreneurship', 'Higher Studies / Research'];

router.post('/', async (req, res) => {
  const body = req.body || {};
  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const password = (body.password || '').trim();
  const rollNo = (body.roll_no || '').trim();
  const branch = (body.branch || 'Computer Science').trim();
  const cgpa = body.cgpa !== undefined && body.cgpa !== '' ? Number(body.cgpa) : null;
  // Frontend's admin-registration flow also sends role/dept/college
  const role = body.role === 'admin' ? 'admin' : 'student';
  const dept = (body.dept || '').trim();
  const college = (body.college || '').trim();
  const section = (body.section || '').trim();
  const year = (body.year || '').trim();
  // Alumni self-registration must say which role they'll play in the portal.
  const position = (body.position || '').trim();
  // Alumni verification details
  const graduationYear = String(body.graduation_year || '').trim();
  const degree = (body.degree || '').trim();

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
    // Gate 1 — official college e-mail only.
    if (!isCollegeEmail(email)) {
      return jsonErr(res, `Alumni registration is restricted to official college e-mail addresses ending with @${COLLEGE_EMAIL_DOMAIN}`);
    }
    // Gate 2 — verification details the holder can match against college records.
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

  // Alumni (role 'admin') who self-register through the Alumni Portal must be
  // approved by a website holder before they can sign in. Students remain
  // active immediately, same as before.
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
    // No session is issued — the account cannot log in until a holder
    // approves it from the "Alumni Management" pending queue.
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
      phone: user.phone,
    },
  });
});

module.exports = router;
