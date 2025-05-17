// routes/ai.js

// Import required packages
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env file
dotenv.config();

const router = express.Router();

// Initialize Gemini AI client using API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route to handle AI-based health plan generation
router.post("/generate-plan", async (req, res) => {
  // Destructure user input from the request body
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

  // Create a structured prompt for the Gemini model
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
    // Get generative model instance (Gemini 2.0 Flash version)
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" }); // Use correct full name

    // Send prompt to Gemini model
    const result = await model.generateContent(prompt); // Keep this for now
    const response = result.response;
    const text = response.text(); // Get the raw text response
    console.log("Gemini raw output:\n", text); // Log response for debugging

    let plan;
    try {
      // Try parsing the response as JSON
      plan = JSON.parse(text);
    } catch (err) {
      // If parsing fails, return raw text as message
      plan = { message: text };
    }

    // Send the plan as JSON response
    res.status(200).json({ success: true, plan });
  } catch (error) {
    // Handle errors and return failure response
    console.error("Gemini API Error:", error.message || error);
    res.status(500).json({
      success: false,
      error: `Failed to generate plan using Gemini: ${error.message || error}`,
    });
  }
});

// Export the router to use in main app
export default router;
