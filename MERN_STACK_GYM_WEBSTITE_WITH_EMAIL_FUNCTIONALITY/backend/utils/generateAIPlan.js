import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API key from environment variable (ensure this is set in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAIPlan = async (data) => {
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    throw new Error("Failed to generate AI plan");
  }
};

export default generateAIPlan;
