import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Importing routes using ES Modules
import healthFormRoutes from "./routes/healthData.js";
import visitRoutes from "./routes/visit.js";
import aiRoutes from "./routes/ai.js";
import otpRoutes from "./routes/otpRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Enhanced CORS configuration
const allowedOrigins = [
  'https://fitgenius-9rps.onrender.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection
const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  };

  try {
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/api/visit", visitRoutes);
app.use("/api/healthdata", healthFormRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/otp", otpRoutes);
app.use('/api/pdf', pdfRoutes);

// Email endpoint
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('FitGenius backend is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({ 
      error: 'CORS Policy Error',
      message: err.message 
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});