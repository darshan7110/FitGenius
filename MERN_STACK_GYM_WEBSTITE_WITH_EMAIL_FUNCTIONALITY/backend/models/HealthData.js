import mongoose from "mongoose";

// Schema to store user's health profile and AI-generated health plan
const HealthSchema = new mongoose.Schema({
  // Basic personal information
  name: String,                           // User's full name
  age: Number,                            // User's age in years
  gender: String,                         // User's gender (e.g., Male, Female, Other)

  // Physical metrics
  weight: Number,                         // User's weight in kilograms
  height: Number,                         // User's height in centimeters

  // Health and fitness goals
  goal: String,                           // User's fitness goal (e.g., lose weight, gain muscle)
  activityLevel: String,                  // User's physical activity level (e.g., sedentary, active)

  // Optional user-specific conditions/preferences
  healthConditions: String,               // Any existing health conditions (e.g., diabetes)
  foodPreferences: String,                // Dietary preferences (e.g., vegetarian, keto)

  // Contact information
  mobile: { type: String, unique: true }, // User's mobile number (used for identification)
  email: { type: String, unique: true, sparse: true }, // Optional email (used for communication)

  // Membership/plan info
  planSelected: String,                   // Name or ID of the selected membership plan

  // AI-generated personalized data
  diet: Object,                           // Generated weekly diet plan (stored as structured JSON)
  workout: Object,                        // Generated workout schedule (stored as structured JSON)
  goalPlan: String                        // Summary or description of the overall goal plan
});

export default mongoose.model("HealthData", HealthSchema);
