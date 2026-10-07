// seed.js — creates the demo accounts referenced by the login screen's hint text
// Run with: npm run seed
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const ExamResult = require('./models/ExamResult');

const DEMO_USERS = [
  {
    name: 'Arjun Sharma',
    email: 'arjun@student.com',
    password: 'student123',
    role: 'student',
    roll_no: 'CS2021001',
    branch: 'Computer Science',
    section: 'A',
    year: '2025-26',
    cgpa: 8.5,
    avg_score: 78,
  },
  // Extra demo students so the Ranking leaderboard has enough data to
  // show all 4 score tiers (High / Second / Third / Low).
  { name: 'Priya Nair',      email: 'priya@student.com',   password: 'student123', role: 'student', roll_no: 'CS2021002', branch: 'Computer Science', section: 'A', year: '2025-26', cgpa: 9.1, avg_score: 92 },
  { name: 'Rahul Verma',     email: 'rahul@student.com',   password: 'student123', role: 'student', roll_no: 'CS2021003', branch: 'Computer Science', section: 'B', year: '2025-26', cgpa: 8.8, avg_score: 85 },
  { name: 'Sneha Iyer',      email: 'sneha@student.com',   password: 'student123', role: 'student', roll_no: 'CS2021004', branch: 'Computer Science', section: 'B', year: '2025-26', cgpa: 7.9, avg_score: 71 },
  { name: 'Karthik Raja',    email: 'karthik@student.com', password: 'student123', role: 'student', roll_no: 'CS2021005', branch: 'Computer Science', section: 'A', year: '2025-26', cgpa: 7.6, avg_score: 64 },
  { name: 'Divya Menon',     email: 'divya@student.com',   password: 'student123', role: 'student', roll_no: 'CS2021006', branch: 'Computer Science', section: 'B', year: '2025-26', cgpa: 7.2, avg_score: 55 },
  { name: 'Vikram Singh',    email: 'vikram@student.com',  password: 'student123', role: 'student', roll_no: 'CS2021007', branch: 'Computer Science', section: 'A', year: '2025-26', cgpa: 6.8, avg_score: 47 },
  { name: 'Ananya Gupta',    email: 'ananya@student.com',  password: 'student123', role: 'student', roll_no: 'CS2021008', branch: 'Computer Science', section: 'B', year: '2025-26', cgpa: 6.5, avg_score: 38 },
  {
    name: 'Placement Admin',
    email: 'admin@placementpro.com',
    password: 'admin123',
    role: 'admin',
    roll_no: 'ADM0001',
    branch: 'Administration',
    dept: 'Training & Placement',
    college: 'PlacementPro Institute',
  },
  {
    name: 'Website Holder',
    email: 'holder@placementpro.com',
    password: 'holder123',
    role: 'holder',
    roll_no: 'OWN0001',
    branch: 'Administration',
  },
];

(async () => {
  await connectDB();

  for (const u of DEMO_USERS) {
    const { avg_score, password, ...userFields } = u;
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`↷ Skipping ${u.email} (already exists)`);
      continue;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const created = await User.create({ ...userFields, password_hash });
    console.log(`✓ Created ${u.role}: ${u.email} / ${password}`);

    // Seed one exam result so this student shows up on the Ranking leaderboard.
    if (u.role === 'student' && avg_score !== undefined) {
      await ExamResult.create({
        user_id: created._id,
        company: 'TechCorp',
        round: 'Aptitude',
        score: avg_score,
        total_q: 20,
        correct_q: Math.round((avg_score / 100) * 20),
        passed: avg_score >= 50,
      });
    }
  }

  console.log('Done.');
  process.exit(0);
})();
