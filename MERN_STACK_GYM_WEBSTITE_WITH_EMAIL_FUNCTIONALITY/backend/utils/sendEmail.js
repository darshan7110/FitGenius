import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message, userEmail }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: userEmail,
    to: email,
    subject: subject,
    text: message,
  });
};
