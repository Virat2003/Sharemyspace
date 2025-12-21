
const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer');

// contact endpoint — accepts { name, email, message }
// Sends an email to me
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    console.log('Contact request received:', { name, email, message });

    // Compose email to me
    const toSupport = process.env.CONTACT_TO || process.env.FROM_EMAIL || 'support@sharemyspace.com';
    const subject = `Contact form: ${name} <${email}>`;
    const body = `You have received a new contact message from ${name} <${email}>:\n\n${message}`;

    const info = await sendEmail(toSupport, subject, body);

    // this is  send an acknowledgement to the user
    try {
      const ackSubject = 'Thanks for contacting ShareMySpace';
      const ackBody = `Hi ${name},\n\nThanks for reaching out. We received your message and will reply soon.\n\n— ShareMySpace team`;
      await sendEmail(email, ackSubject, ackBody);
    } catch (ackErr) {
      console.warn('Failed to send acknowledgement email to user:', ackErr.message || ackErr);
    }

    // If using Ethereal / test account, include preview URL for dev convenience
    const preview = nodemailer.getTestMessageUrl(info) || null;

    return res.status(200).json({ message: 'Contact message sent successfully.', preview });
  } catch (err) {
    console.error('Contact route error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
