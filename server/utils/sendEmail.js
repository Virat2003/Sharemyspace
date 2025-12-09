const nodemailer = require('nodemailer');

// sendEmail(email, subject, message)
// Uses SMTP config from env or falls back to Ethereal test account in development.
// Env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, SMTP_SECURE
async function sendEmail(to, subject, text) {
  try {
    let transporter;
    let usingEthereal = false;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback to Ethereal for development/testing
      usingEthereal = true;
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER || (usingEthereal && 'no-reply@ethereal.email'),
      to,
      subject,
      text,
    });

    if (usingEthereal) {
      // log preview URL so developer can inspect the message
      console.log('Ethereal message preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (err) {
    console.error('sendEmail error:', err);
    throw err;
  }
}

module.exports = sendEmail;
