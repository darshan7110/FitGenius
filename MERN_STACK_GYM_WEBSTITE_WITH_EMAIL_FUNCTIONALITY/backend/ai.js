// backend/ai.js

// 🧠 Function: getAIPlan
// This is a mock implementation that generates a simple static fitness plan
// based on user's basic info like name, weight, height, and goal.
// Replace this logic with real AI logic (e.g. OpenAI, Gemini API) in production.

export async function getAIPlan(userData) {
  // ✨ Destructure relevant fields from the incoming user data
  const { name, weight, height, goal } = userData;

  // 📦 Return a static response (can be replaced with dynamic AI-generated data)
  return {
    message: `Hello ${name}, based on your weight of ${weight}kg and height of ${height}cm, here is your personalized fitness plan.`,
    
    // 🥗 Sample Diet Plan
    diet: [
      "Breakfast: Oats with banana & almonds",
      "Lunch: Grilled chicken with brown rice",
      "Dinner: Boiled veggies + soup",
    ],

    // 💪 Sample Exercise Plan
    exercise: [
      "20 mins running",
      "15 mins bodyweight training",
      "Stretching & cool down",
    ],

    // 🎯 Goal Summary (default: "General Fitness" if not provided)
    goal: goal || "General Fitness"
  };
}
