// admin panel added - dev utility
// Usage (from server folder):
//   node scripts/resetPassword.js user@example.com newPassword [--admin] [--verify]
// This will set the user's password to `newPassword`. Use only in development.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node scripts/resetPassword.js email newPassword [--admin] [--verify]');
    process.exit(1);
  }

  const [email, newPassword, ...flags] = args;
  const makeAdmin = flags.includes('--admin');
  const makeVerified = flags.includes('--verify');

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: 'shareMyspace',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      process.exit(1);
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    if (makeAdmin) user.role = 'admin';
    if (makeVerified) user.isVerified = true;

    await user.save();
    console.log(`Updated password for ${email}. admin=${makeAdmin} verified=${makeVerified}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
