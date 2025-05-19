// app.js
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Enable CORS for frontend
app.use(cors({
  origin: 'https://fitgenius-9rps.onrender.com', // Frontend URL
  credentials: true 
}));

// Enable JSON and form body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import API routes
import healthFormRoutes from "./routes/healthData.js";
import visitRoutes from "./routes/visit.js";
import aiRoutes from "./routes/ai.js";
import otpRoutes from "./routes/otpRoutes.js"; // OTP routes

// Use routes
app.use("/api/visit", visitRoutes);            // Track visit data
app.use("/api/healthdata", healthFormRoutes);  // Health data (diet/workout)
app.use("/api/ai", aiRoutes);                  // AI-generated plans
app.use("/api/otp", otpRoutes);                // OTP email verification

// Contact form mail route
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

// Test route
app.get('/', (req, res) => {
  res.send('FitGenius backend is running!');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
