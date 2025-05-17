// ✅ Import Gemini AI SDK from Google's generative AI package
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Load Gemini API key from environment variables (.env file must contain GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Function: generateAIPlan
// Input: `data` object with user health details
// Purpose: Generates a personalized weekly plan using Gemini AI
const generateAIPlan = async (data) => {
  // 🧠 Prepare dynamic prompt with user-specific inputs
  const prompt = `
You are a fitness expert. Create a weekly personalized plan (diet, workout, goal summary) for:
- Name: ${data.name}
- Age: ${data.age}, Gender: ${data.gender}
- Weight: ${data.weight}kg, Height: ${data.height}cm
- Goal: ${data.goal}
- Activity Level: ${data.activityLevel}
- Health Conditions: ${data.healthConditions}
- Food Preferences: ${data.foodPreferences}
- Plan Type: ${data.planSelected}

Return in the format:
Diet:
Monday: ...
Tuesday: ...
...
Workout:
Monday: ...
Tuesday: ...
...
Goal Summary:
...
  `;

  try {
    // ⚙️ Initialize Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 🚀 Generate content using the AI model with the prepared prompt
    const result = await model.generateContent(prompt);

    // 📥 Extract plain text output from response
    const response = await result.response;
    const text = response.text();

    // ✅ Return AI-generated plan as plain text
    return text;
  } catch (error) {
    // ❌ Log and throw a custom error if something fails
    console.error("❌ Gemini API Error:", error);
    throw new Error("Failed to generate AI plan");
  }
};

// ✅ Export the function so it can be imported and used elsewhere in the backend
export default generateAIPlan;
