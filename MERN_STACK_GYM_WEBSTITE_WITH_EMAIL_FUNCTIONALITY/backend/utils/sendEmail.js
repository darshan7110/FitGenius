// ✅ Import Nodemailer module to handle email sending
import nodemailer from "nodemailer";

// ✅ Main function to send email using SMTP configuration
export const sendEmail = async ({ email, subject, message, userEmail }) => {
  // ✉️ Create a Nodemailer transporter with SMTP credentials from environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,   // 🔐 Secret: SMTP server hostname (e.g., smtp.gmail.com)
    port: process.env.SMTP_PORT,   // 🔐 Secret: SMTP server port (e.g., 587 for TLS)
    secure: false,                 // Use TLS (set to true if using port 465)
    auth: {
      user: process.env.SMTP_USER, // 🔐 Secret: Email address or username
      pass: process.env.SMTP_PASS, // 🔐 Secret: App password or SMTP password
    },
  });

  // 📧 Send the email using the transporter
  await transporter.sendMail({
    from: userEmail,  // Sender’s email address
    to: email,        // Recipient’s email address
    subject: subject, // Email subject line
    text: message,    // Plain text message body
  });
};
