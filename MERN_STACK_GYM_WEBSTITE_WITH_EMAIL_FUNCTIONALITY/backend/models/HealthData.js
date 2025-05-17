import mongoose from "mongoose";

const HealthSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  weight: Number,
  height: Number,
  goal: String,
  activityLevel: String,
  healthConditions: String,
  foodPreferences: String,
  mobile: { type: String, unique: true },
  email: { type: String, unique: true, sparse: true },
  planSelected: String,
  diet: Object,           // 🆕 AI-generated
  workout: Object,        // 🆕 AI-generated
  goalPlan: String        // 🆕 AI-generated
});


export default mongoose.model("HealthData", HealthSchema);
