// config/db.js — MongoDB connection (replaces the old config/db.php / PDO setup)
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placementpro';
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected:', uri);
  } catch (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
