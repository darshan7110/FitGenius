// backend/ai.js
export async function getAIPlan(userData) {
  // Replace this with your real OpenAI API logic later
  const { name, weight, height, goal } = userData;

  return {
    message: `Hello ${name}, based on your weight of ${weight}kg and height of ${height}cm, here is your personalized fitness plan.`,
    diet: [
      "Breakfast: Oats with banana & almonds",
      "Lunch: Grilled chicken with brown rice",
      "Dinner: Boiled veggies + soup",
    ],
    exercise: [
      "20 mins running",
      "15 mins bodyweight training",
      "Stretching & cool down",
    ],
    goal: goal || "General Fitness"
  };
}
