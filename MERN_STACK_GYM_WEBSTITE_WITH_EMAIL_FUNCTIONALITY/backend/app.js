// app.js
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); 

// Import routes
import healthFormRoutes from "./routes/healthData.js";
import visitRoutes from "./routes/visit.js";
import aiRoutes from "./routes/ai.js";

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/GymManagement", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/visit", visitRoutes);

app.use("/api/healthdata", healthFormRoutes); // ✅ Correct route prefix

app.use("/api/ai", aiRoutes);

// Email route
app.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "darshanjain707@gmail.com",
        pass: "tizy ctde qxgj zbno", // Be sure this is stored in env in production!
      },
    });

    const mailOptions = {
      from: email,
      to: "darshanjain707@gmail.com",
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

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
