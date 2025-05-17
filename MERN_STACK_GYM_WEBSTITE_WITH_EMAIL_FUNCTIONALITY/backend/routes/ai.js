// routes/ai.js
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-plan", async (req, res) => {
  const {
    name,
    age,
    weight,
    height,
    goal,
    activityLevel,
    healthConditions,
    foodPreferences,
  } = req.body;

  const prompt = `Create a personalized diet and workout plan for the following person:



Respond in JSON format like:
{
  "message": "Hello NAME, based on your data, here's your plan...",
  "diet": {
    "Monday": ["Breakfast: ...", "Lunch: ...", "Dinner: ..."],
    ...
  },
  "workout": {
    "Monday": ["Exercise 1", "Exercise 2"],
    ...
  },
  "goal": "..."
}

- Name: ${name}
- Age: ${age}
- Weight: ${weight}kg
- Height: ${height}cm
- Goal: ${goal}
- Activity Level: ${activityLevel}
- Health Conditions: ${healthConditions || "None"}
- Food Preferences: ${foodPreferences || "None"}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" }); // Use correct full name


    const result = await model.generateContent(prompt); // Keep this for now
    const response = result.response;
    const text = response.text();
    console.log("Gemini raw output:\n", text);

    let plan;
    try {
      plan = JSON.parse(text);
    } catch (err) {
      plan = { message: text };
    }

    res.status(200).json({ success: true, plan });
  } catch (error) {
    console.error("Gemini API Error:", error.message || error);
    res.status(500).json({
      success: false,
      error: `Failed to generate plan using Gemini: ${error.message || error}`,
    });
  }
});

export default router;
