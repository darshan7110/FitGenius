import mongoose from "mongoose";

// Schema to track the total number of visits (e.g., to the site or a specific page)
const visitSchema = new mongoose.Schema({
  count: {
    type: Number,       // Number of visits
    default: 0,         // Initialized to 0 on first creation
  },
});

// Model to interact with the 'Visit' collection in MongoDB
const Visit = mongoose.model("Visit", visitSchema);

export default Visit;
