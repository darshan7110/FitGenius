import express from 'express';
import HealthData from '../models/HealthData.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// ✅ GET /api/healthdata/:mobile — Get user by mobile number
router.get('/:mobile', async (req, res) => {
  try {
    const user = await HealthData.findOne({ mobile: req.params.mobile });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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

    const {
      name, age, gender, weight, height,
      goal, activityLevel, healthConditions,
      foodPreferences, planSelected, mobile, email
    } = req.body;

    // Required fields validation
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

    // 🧠 Prepare Gemini AI prompt
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

    // 🔑 Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing in .env" });
    }

    // 🚀 Call Gemini API
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

      aiPlan = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
      console.log("✅ Gemini AI Plan Generated");
    } catch (err) {
      console.error("❌ Gemini API Error:", err.response?.data || err.message);
      return res.status(500).json({ error: "Failed to generate AI plan" });
    }

    // 🧠 Parse the AI response into parts
    const dietSection = aiPlan.split("Workout:")[0]?.replace("Diet:", "").trim();
    const workoutSection = aiPlan.split("Workout:")[1]?.split("Goal Summary:")[0]?.trim();
    const goalPlanSection = aiPlan.split("Goal Summary:")[1]?.trim();

    // 📦 Save to MongoDB
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

    res.status(201).json(newUser);

  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
