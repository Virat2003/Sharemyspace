const bcrypt = require('bcryptjs');

// Generate a 6-digit numeric OTP and its bcrypt hash
async function generateOtp() {
  // generate 6 digit OTP, leading zeros allowed
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(otp, salt);
  return { otp, hashed }; // return plain otp for sending and hashed for storing
}

module.exports = { generateOtp };
