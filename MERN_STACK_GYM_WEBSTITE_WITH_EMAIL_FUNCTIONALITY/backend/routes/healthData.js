import express from 'express';
import HealthData from '../models/HealthData.js';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file (e.g., GEMINI_API_KEY)
dotenv.config();

const router = express.Router();

// ✅ GET /api/healthdata/:mobile — Get user by mobile number
router.get('/:mobile', async (req, res) => {
  try {
    // Find user in DB by mobile number from URL parameter
    const user = await HealthData.findOne({ mobile: req.params.mobile });

    if (!user) {
      // Return 404 if user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data if found
    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Error fetching user by mobile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST /api/healthdata — Add new user and generate plan
router.post('/', async (req, res) => {
  try {
    console.log("📥 Incoming Request Body:", req.body);

    // Destructure user form input from the request body
    const {
      name, age, gender, weight, height,
      goal, activityLevel, healthConditions,
      foodPreferences, planSelected, mobile, email
    } = req.body;

    // 🚨 Validate required fields
    if (!name || !age || !gender || !weight || !height || !goal || !activityLevel || !mobile) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🔍 Check if user already exists by mobile or email
    const existingUser = await HealthData.findOne({
      $or: [{ mobile }, { email }]
    });

    if (existingUser) {
      console.log("ℹ️ User already exists, returning existing data.");
      return res.status(200).json(existingUser);
    }

    // 🧠 Construct prompt for Gemini AI to generate plan
    const prompt = `
You are a fitness expert. Create a weekly personalized plan (diet, workout, goal summary) for:
- Name: ${name}
- Age: ${age}, Gender: ${gender}
- Weight: ${weight}kg, Height: ${height}cm
- Goal: ${goal}
- Activity Level: ${activityLevel}
- Health Conditions: ${healthConditions || 'None'}
- Food Preferences: ${foodPreferences || 'None'}
- Plan Type: ${planSelected}

Return in the format:
Diet:
Monday: ...
Tuesday: ...
...
Workout:
Monday: ...
Tuesday: ...
...
Goal Summary: ...
`;

    // 🔐 Get Gemini API Key from .env (SECRET KEY)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing in .env" });
    }

    // 🚀 Call Gemini API using axios
    let aiPlan = "";
    try {
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract AI response text
      aiPlan = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      console.log("✅ Gemini AI Plan Generated");
    } catch (err) {
      console.error("❌ Gemini API Error:", err.response?.data || err.message);
      return res.status(500).json({ error: "Failed to generate AI plan" });
    }

    // 🧠 Split AI response into diet, workout, and goalPlan sections
    const dietSection = aiPlan.split("Workout:")[0]?.replace("Diet:", "").trim();
    const workoutSection = aiPlan.split("Workout:")[1]?.split("Goal Summary:")[0]?.trim();
    const goalPlanSection = aiPlan.split("Goal Summary:")[1]?.trim();

    // 💾 Create and save new user record in MongoDB
    const newUser = new HealthData({
      name, age, gender, weight, height,
      goal, activityLevel, healthConditions,
      foodPreferences, planSelected,
      diet: { content: dietSection },
      workout: { content: workoutSection },
      goalPlan: goalPlanSection,
      mobile,
      email
    });

    await newUser.save();
    console.log("✅ New user saved:", newUser);

    // ✅ Respond with the saved user
    res.status(201).json(newUser);

  } catch (err) {
    // 🛑 Catch any unexpected server errors
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
