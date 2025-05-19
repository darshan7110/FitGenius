// app.js
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

// Import routes
import healthFormRoutes from "./routes/healthData.js";
import visitRoutes from "./routes/visit.js";
import aiRoutes from "./routes/ai.js";

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ MongoDB connection using Atlas URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors({
  origin: 'https://fitgenius-9rps.onrender.com',
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/visit", visitRoutes);
app.use("/api/healthdata", healthFormRoutes);
app.use("/api/ai", aiRoutes);

// Email route
app.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "process.env.MAIL_USER",
        pass: "process.env.MAIL_PASS", // 🔐 Move this to .env for security
      },
    });

    const mailOptions = {
      from: email,
      to: "MAIL_USER",
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
app.get('/', (req, res) => {
  res.send('FitGenius backend is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
