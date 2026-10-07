// routes/profile.js — GET (fetch) / POST (update) /api/profile.php (replaces api/profile.php)
const express = require('express');
const router = express.Router();

const ExamResult = require('../models/ExamResult');
const CompletedRound = require('../models/CompletedRound');
const { jsonOk, jsonErr, requireAuth } = require('../middleware/helpers');

router.get('/', requireAuth(), async (req, res) => {
  const user = req.user;
  let completedRounds = {};
  let scores = {};

  if (user.role === 'student') {
    const crRows = await CompletedRound.find({ user_id: user._id });
    crRows.forEach((row) => {
      if (!completedRounds[row.company]) completedRounds[row.company] = [];
      completedRounds[row.company].push(row.round);
    });

    const scRows = await ExamResult.find({ user_id: user._id }).sort({ taken_at: -1 });
    scRows.forEach((row) => {
      const key = `${row.company}_${row.round}`;
      if (!(key in scores)) scores[key] = row.score;
    });
  }

  return jsonOk(res, {
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
      position: user.position,
      graduation_year: user.graduation_year,
      degree: user.degree,
      avatar: user.avatar,
      bio: user.bio,
      company: user.company || '',
      job_title: user.job_title || '',
      experience_years: user.experience_years ?? null,
      skills: user.skills || [],
      linkedin: user.linkedin || '',
      open_to_mentorship: user.open_to_mentorship !== false,
      open_to_referral: user.open_to_referral !== false,
      dream_companies: user.dream_companies || [],
      completedRounds,
      scores,
    },
  });
});

router.post('/', requireAuth(), async (req, res) => {
  const user = req.user;
  const body = req.body || {};

  const name = (body.name ?? (user.name || '')).trim();
  const branch = (body.branch ?? (user.branch || '')).trim();
  const cgpa = body.cgpa !== undefined && body.cgpa !== '' && body.cgpa !== null ? Number(body.cgpa) : null;
  const phone = (body.phone ?? (user.phone || '')).trim();

  if (!name) return jsonErr(res, 'Name cannot be empty');

  // ── Profile picture (data-URL) ────────────────────────────────
  // Sent as a base64 data-URL. '' (empty string) removes the picture.
  if (body.avatar !== undefined) {
    const avatar = String(body.avatar || '').trim();
    if (avatar !== '') {
      if (!/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(avatar)) {
        return jsonErr(res, 'Profile picture must be a PNG, JPG, WEBP or GIF image');
      }
      // base64 inflates by ~4/3 — cap the decoded size at ~1.5 MB.
      const bytes = Math.floor((avatar.length - avatar.indexOf(',') - 1) * 3 / 4);
      if (bytes > 1.5 * 1024 * 1024) {
        return jsonErr(res, 'Profile picture is too large (max 1.5 MB after resizing)');
      }
    }
    user.avatar = avatar;
  }

  // ── Quote / self-bio ──────────────────────────────────────────
  if (body.bio !== undefined) {
    const bio = String(body.bio || '').replace(/\s+$/, '').slice(0, 300);
    user.bio = bio;
  }

  // ── Alumni-connect / mentoring profile fields ─────────────────
  if (body.company !== undefined) user.company = String(body.company || '').trim();
  if (body.job_title !== undefined) user.job_title = String(body.job_title || '').trim();
  if (body.linkedin !== undefined) user.linkedin = String(body.linkedin || '').trim();
  if (body.experience_years !== undefined) {
    const yrs = body.experience_years === '' || body.experience_years === null ? null : Number(body.experience_years);
    user.experience_years = Number.isFinite(yrs) ? yrs : null;
  }
  if (body.skills !== undefined) {
    const raw = Array.isArray(body.skills) ? body.skills : String(body.skills || '').split(',');
    user.skills = raw.map((s) => String(s).trim()).filter(Boolean).slice(0, 15);
  }
  if (body.dream_companies !== undefined) {
    const raw = Array.isArray(body.dream_companies) ? body.dream_companies : String(body.dream_companies || '').split(',');
    user.dream_companies = raw.map((s) => String(s).trim()).filter(Boolean).slice(0, 10);
  }
  if (body.open_to_mentorship !== undefined) user.open_to_mentorship = !!body.open_to_mentorship;
  if (body.open_to_referral !== undefined) user.open_to_referral = !!body.open_to_referral;

  user.name = name;
  user.branch = branch;
  user.cgpa = cgpa;
  user.phone = phone;
  await user.save();

  return jsonOk(res, { message: 'Profile updated successfully', avatar: user.avatar, bio: user.bio });
});

module.exports = router;
