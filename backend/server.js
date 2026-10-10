// server.js — PlacementPro API entry point (Express + MongoDB)
// This replaces the whole XAMPP/PHP `api/` folder. Routes are mounted at the
// EXACT same paths the original frontend JS already calls (e.g. /api/login.php)
// so the existing client-side code needs no changes beyond the API_BASE URL.

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config(); // also check current working directory

const express = require('express');
const connectDB = require('./config/db');

const app = express();

// ── Bulletproof CORS + OPTIONS Preflight Middleware ──────────────
// Allows the deployed frontend, preview deployments, and local dev.
// Echoes back Access-Control-Request-Headers so custom headers (like X-Token)
// never trigger browser CORS preflight rejection.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] ||
      'Content-Type, Authorization, X-Token, x-token, Accept, Origin, Cache-Control, X-Requested-With'
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  // Immediately answer preflight OPTIONS with 204 No Content
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// ── Health check (mounted before DB check so monitoring always succeeds) ─
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PlacementPro API is running',
    timestamp: new Date().toISOString(),
    dbConfigured: Boolean(process.env.MONGO_URI),
  });
});

// ── Body parsing ──────────────────────────────────────────────────
// Limit raised to 10mb because profile pictures travel as data-URLs.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── DB (lazy connect — safe for Vercel serverless) ────────────────
let _dbReady = false;
let _dbPromise = null;

function ensureDB() {
  if (_dbReady) return Promise.resolve();
  if (!_dbPromise) {
    _dbPromise = connectDB()
      .then(() => { _dbReady = true; })
      .catch((err) => {
        _dbPromise = null; // allow retry on next request
        throw err;
      });
  }
  return _dbPromise;
}

// Middleware that ensures DB connection before API routes
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(503).json({ success: false, message: 'Database temporarily unavailable. Please try again in a moment.' });
  }
});

// ── Routes (1:1 with the original PHP files) ───────────────────
app.use('/api/login.php',          require('./routes/login'));
app.use('/api/register.php',       require('./routes/register'));
app.use('/api/logout.php',         require('./routes/logout'));
app.use('/api/profile.php',        require('./routes/profile'));
app.use('/api/save_result.php',    require('./routes/saveResult'));
app.use('/api/admin_students.php', require('./routes/adminStudents'));
app.use('/api/admin_results.php',  require('./routes/adminResults'));
app.use('/api/admin_manage.php',   require('./routes/adminManage'));
app.use('/api/ranking.php',        require('./routes/ranking'));
app.use('/api/delete_account.php', require('./routes/deleteAccount'));
app.use('/api/chat.php',           require('./routes/chat'));

// ── Alumni-connect features ────────────────────────────────────
app.use('/api/alumni.php',         require('./routes/alumni'));
app.use('/api/mentorship.php',     require('./routes/mentorship'));
app.use('/api/experiences.php',    require('./routes/experiences'));
app.use('/api/referrals.php',      require('./routes/referrals'));
app.use('/api/forum.php',          require('./routes/forum'));

// ── Catch-all for unknown API routes ──────────────────────────
app.use('/api/*', (req, res) =>
  res.status(404).json({ success: false, message: 'API endpoint not found' })
);

// ── Global error handler ───────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Local dev server ───────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => app.listen(PORT, () =>
      console.log(`🚀 PlacementPro API listening on http://localhost:${PORT}`)
    ))
    .catch((err) => {
      console.error('Failed to start server:', err.message);
      process.exit(1);
    });
}

// Vercel serverless requires the Express app exported as default
module.exports = app;
