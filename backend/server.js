// server.js — PlacementPro API entry point (Express + MongoDB)
// This replaces the whole XAMPP/PHP `api/` folder. Routes are mounted at the
// EXACT same paths the original frontend JS already calls (e.g. /api/login.php)
// so the existing client-side code needs no changes beyond the API_BASE URL.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions)); // large-ish: profile pictures travel as data-URLs
app.use(express.json());

// ── Routes (1:1 with the original PHP files) ───────────────────
app.use('/api/login.php', require('./routes/login'));
app.use('/api/register.php', require('./routes/register'));
app.use('/api/logout.php', require('./routes/logout'));
app.use('/api/profile.php', require('./routes/profile'));
app.use('/api/save_result.php', require('./routes/saveResult'));
app.use('/api/admin_students.php', require('./routes/adminStudents'));
app.use('/api/admin_results.php', require('./routes/adminResults'));
app.use('/api/admin_manage.php', require('./routes/adminManage'));
app.use('/api/ranking.php', require('./routes/ranking'));
app.use('/api/delete_account.php', require('./routes/deleteAccount'));
app.use('/api/chat.php', require('./routes/chat'));

// ── Alumni-connect features (directory, mentorship, experiences,
//    referrals, Q&A forum) ─────────────────────────────────────
app.use('/api/alumni.php', require('./routes/alumni'));
app.use('/api/mentorship.php', require('./routes/mentorship'));
app.use('/api/experiences.php', require('./routes/experiences'));
app.use('/api/referrals.php', require('./routes/referrals'));
app.use('/api/forum.php', require('./routes/forum'));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'PlacementPro API is running' }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 PlacementPro API listening on http://localhost:${PORT}`));
});
