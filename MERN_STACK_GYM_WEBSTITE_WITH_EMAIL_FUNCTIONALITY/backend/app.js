// Import required modules
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Import route handlers
import healthFormRoutes from "./routes/healthData.js";
import visitRoutes from "./routes/visit.js";
import aiRoutes from "./routes/ai.js";
import otpRoutes from "./routes/otpRoutes.js"; // 🔐 OTP routes for email verification

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Enable CORS for frontend URL
app.use(cors({
  origin: 'https://fitgenius-9rps.onrender.com',
  credentials: true 
}));

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API routes
app.use("/api/visit", visitRoutes);           // 👣 Visitor count route
app.use("/api/healthdata", healthFormRoutes); // 🏥 Health form submission/retrieval
app.use("/api/ai", aiRoutes);                 // 🤖 AI plan generation routes
app.use("/api/otp", otpRoutes);               // 🔐 OTP verification for email

// 📬 Contact Form Email Sender
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

// Base route
app.get('/', (req, res) => {
  res.send('FitGenius backend is running!');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
