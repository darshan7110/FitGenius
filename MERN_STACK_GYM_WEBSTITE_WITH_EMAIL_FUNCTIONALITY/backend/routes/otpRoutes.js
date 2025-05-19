// OTP routes to send/verify OTPs for email validation
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Store OTPs temporarily in memory (you can move this to Redis or DB later)
const otpStore = {};

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure mail sender
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Endpoint to send OTP to email
router.post('/send', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Valid for 5 minutes

  otpStore[email] = { otp, expiresAt };

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Your FitGenius OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Endpoint to verify submitted OTP
router.post('/verify', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: 'No OTP found for this email' });

  const now = new Date();
  if (now > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (otp !== record.otp) return res.status(400).json({ message: 'Invalid OTP' });

  delete otpStore[email]; // OTP verified, clean up
  return res.status(200).json({ message: 'OTP verified' });
});

export default router;
