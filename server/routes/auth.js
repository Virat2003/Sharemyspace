const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/User");
const { generateOtp } = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

/* USER REGISTER */
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    /* Take all information from the form */
    const { firstName, lastName, email, password } = req.body;

    /* The uploaded file is available as req.file */
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    /* path to the uploaded profile photo */
    const profileImagePath = profileImage.path;

    /* Check if user exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    /* Hash the password */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Create a new User (unverified) */
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
      isVerified: false,
    });

    /* Save the new User */
    await newUser.save();

    /* Generate OTP and store hashed value with expiry (5 minutes) */
    const { otp, hashed } = await generateOtp();
    newUser.otp = hashed;
    newUser.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await newUser.save();

    /* Send OTP to user's email */
    const message = `Your verification code is: ${otp}. It expires in 5 minutes.`;
    try {
      await sendEmail(email, "Your account verification code", message);
    } catch (emailErr) {
      console.error('Failed to send OTP email:', emailErr);
      // don't reveal internals to client
    }

    /* Respond without sensitive fields */
    const { password: pwd, otp: _otp, ...userWithoutSensitive } = newUser._doc;
    res.status(200).json({ message: "User registered. OTP sent to email.", user: userWithoutSensitive });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Registration failed!", error: err.message });
  }
});

/* VERIFY OTP */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required.' });

    // need to select otp explicitly because it's select:false
    const user = await User.findOne({ email }).select('+otp +otpExpiry +isVerified');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.isVerified) return res.status(400).json({ message: 'Account already verified.' });

    if (!user.otp || !user.otpExpiry) return res.status(400).json({ message: 'No OTP found. Please request a new code.' });

    if (Date.now() > new Date(user.otpExpiry).getTime()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new code.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP.' });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: 'Account verified successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* RESEND OTP */
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email }).select('+otpRequestedAt +isVerified');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.isVerified) return res.status(400).json({ message: 'Account already verified.' });

    const now = Date.now();
    const lastRequested = user.otpRequestedAt ? new Date(user.otpRequestedAt).getTime() : 0;
    const RESEND_WINDOW = 60 * 1000; // 60 seconds
    if (now - lastRequested < RESEND_WINDOW) {
      const wait = Math.ceil((RESEND_WINDOW - (now - lastRequested)) / 1000);
      return res.status(429).json({ message: `Please wait ${wait}s before requesting another code.` });
    }

    // generate and store
    const { otp, hashed } = await generateOtp();
    user.otp = hashed;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.otpRequestedAt = Date.now();
    await user.save();

    const message = `Your new verification code is: ${otp}. It expires in 5 minutes.`;
    try {
      await sendEmail(email, 'Your account verification code', message);
    } catch (emailErr) {
      console.error('Failed to send OTP email:', emailErr);
    }

    return res.status(200).json({ message: 'OTP resent to email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* FORGOT PASSWORD - generate and send OTP for password reset */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpiry +resetOtpRequestedAt');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const now = Date.now();
    const lastRequested = user.resetOtpRequestedAt ? new Date(user.resetOtpRequestedAt).getTime() : 0;
    const RESEND_WINDOW = 60 * 1000; // 60 seconds
    if (now - lastRequested < RESEND_WINDOW) {
      const wait = Math.ceil((RESEND_WINDOW - (now - lastRequested)) / 1000);
      return res.status(429).json({ message: `Please wait ${wait}s before requesting another code.` });
    }

    const { otp, hashed } = await generateOtp();
    user.resetOtp = hashed;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes for reset
    user.resetOtpRequestedAt = Date.now();
    await user.save();

    const message = `Your password reset code is: ${otp}. It expires in 10 minutes.`;
    try {
      await sendEmail(email, 'Password reset code', message);
    } catch (emailErr) {
      console.error('Failed to send reset OTP email:', emailErr);
    }

    return res.status(200).json({ message: 'Password reset code sent to email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* VERIFY RESET OTP */
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required.' });

    const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpiry');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (!user.resetOtp || !user.resetOtpExpiry) return res.status(400).json({ message: 'No reset OTP found. Please request a new code.' });

    if (Date.now() > new Date(user.resetOtpExpiry).getTime()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new code.' });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP.' });

    // Optionally, we can issue a short-lived JWT token for password reset, but to keep flow simple,
    // we'll return success and let frontend proceed to reset-password form which also requires email.
    // For higher security, return a resetToken here and store it hashed server-side.

    // clear reset otp so it can't be reused
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    await user.save();

    return res.status(200).json({ message: 'OTP verified. You may reset your password now.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* RESET PASSWORD */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: 'Email and newPassword are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Hash the new password and save
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* DEV: test email sender - posts { email, subject?, text? } */
router.post('/test-email', async (req, res) => {
  try {
    const { email, subject, text } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const info = await sendEmail(email, subject || 'Test email from ShareMySpace', text || 'This is a test.');

    // If nodemailer test account was used, generate preview URL
    const preview = nodemailer.getTestMessageUrl(info) || null;
    return res.status(200).json({ message: 'Email sent (or attempted).', preview, info });
  } catch (err) {
    console.error('test-email error:', err);
    return res.status(500).json({ message: 'Failed to send test email.', error: err.message });
  }
});

/* USER LOGIN*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

      if (!user.isVerified) {
        return res.status(403).json({ message: 'Account not verified. Please check your email for the OTP.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // optional
    });

    // Remove password before sending user data
    const { password: pwd, ...userWithoutPassword } = user._doc;

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router
