// config/db.js — MongoDB connection (replaces the old config/db.php / PDO setup)
const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return; // reuse connection across Vercel invocations

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI environment variable is not set. Add it in Vercel → Settings → Environment Variables.');
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      // Vercel serverless: don't keep the event loop alive between invocations
      bufferCommands: false,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    isConnected = false;
    console.error('❌ Database connection error:', err.message);
    // Re-throw so the caller (server.js) can return 503 to the client.
    // Do NOT call process.exit() — that would kill the serverless function container.
    throw err;
  }
}

module.exports = connectDB;
