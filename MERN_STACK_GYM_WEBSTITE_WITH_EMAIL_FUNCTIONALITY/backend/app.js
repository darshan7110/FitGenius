// app.js - Main server entry point for FitGenius backend

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Importing routes
import healthFormRoutes from "./routes/healthData.js";
import visitRoutes from "./routes/visit.js";
import aiRoutes from "./routes/ai.js";
import otpRoutes from "./routes/otpRoutes.js"; // OTP Route added

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Connect to MongoDB Atlas using credentials from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Enable CORS for frontend origin
app.use(cors({
  origin: 'https://fitgenius-9rps.onrender.com',
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mounting route handlers
app.use("/api/visit", visitRoutes);         // For tracking visits
app.use("/api/healthdata", healthFormRoutes); // For health form CRUD
app.use("/api/ai", aiRoutes);               // For AI-generated plans
app.use("/api/otp", otpRoutes);             // For OTP send/verify

// ✅ Contact form route using Nodemailer
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

// Default route for server status
app.get('/', (req, res) => {
  res.send('FitGenius backend is running!');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
