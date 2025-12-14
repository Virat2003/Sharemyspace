// admin panel added - dev utility
// Usage: node scripts/checkUser.js email password

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node scripts/checkUser.js email password');
    process.exit(1);
  }
  const [email, password] = args;
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: 'shareMyspace',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const user = await User.findOne({ email }).select('+password +otp +resetOtp');
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }
    console.log('User found:');
    console.log(' _id:', user._id.toString());
    console.log(' email:', user.email);
    console.log(' role:', user.role);
    console.log(' isVerified:', user.isVerified);
    const match = await bcrypt.compare(password, user.password);
    console.log(' password matches?:', match);
    process.exit(match ? 0 : 2);
  } catch (err) {
    console.error('Error:', err);
    process.exit(3);
  }
}

main();
