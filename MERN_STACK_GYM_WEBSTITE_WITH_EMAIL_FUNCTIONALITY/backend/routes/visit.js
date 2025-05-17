import express from "express";
import Visit from "../models/Visit.js"; // ✅ Import the Visit model (used to track site visits)

const router = express.Router();

// ✅ ROUTE 1: Track and increment total visits
// Method: GET /api/visit/
// Purpose: Each time this route is hit, increment the visit count by 1
router.get("/", async (req, res) => {
  try {
    // 🔍 Check if a visit record already exists
    let visit = await Visit.findOne();

    if (!visit) {
      // ⛳ If not found, create a new document with initial count = 1
      visit = await Visit.create({ count: 1 });
    } else {
      // ➕ If found, increment the count and save
      visit.count += 1;
      await visit.save();
    }

    // ✅ Respond with the updated count
    res.status(200).json({ message: "Visit counted", count: visit.count });
  } catch (error) {
    // ❌ Handle any unexpected errors
    console.error("Error tracking visit:", error);
    res.status(500).json({ message: "Error tracking visit" });
  }
});

// ✅ ROUTE 2: Get current visit count
// Method: GET /api/visit/count
// Purpose: Returns the current number of visits without incrementing
router.get("/count", async (req, res) => {
  try {
    // 🔍 Get the visit count document
    const visit = await Visit.findOne();

    // ✅ Return the count (0 if not found)
    res.status(200).json({ count: visit?.count || 0 });
  } catch (error) {
    // ❌ Handle errors gracefully
    console.error("Error fetching visit count:", error);
    res.status(500).json({ message: "Error fetching visit count" });
  }
});

export default router; // ✅ Export router for use in main server file
