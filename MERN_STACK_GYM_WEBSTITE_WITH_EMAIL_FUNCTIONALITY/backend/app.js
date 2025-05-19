import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

// Importing routes
import healthFormRoutes from "./routes/healthData.js";
import visitRoutes from "./routes/visit.js";
import aiRoutes from "./routes/ai.js";
import otpRoutes from "./routes/otpRoutes.js"; // OTP routes
const pdfRoutes = require('./routes/pdfRoutes');



const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(cors({
  origin: 'https://fitgenius-9rps.onrender.com',
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/visit", visitRoutes);
app.use("/api/healthdata", healthFormRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/otp", otpRoutes);
app.use('/api/pdf', pdfRoutes);

app.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.MAIL_USER,
      subject: `New message from ${name}`,
      text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Mail sent successfully!" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res.status(500).json({ message: "Failed to send mail." });
  }
});

app.get('/', (req, res) => {
  res.send('FitGenius backend is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
