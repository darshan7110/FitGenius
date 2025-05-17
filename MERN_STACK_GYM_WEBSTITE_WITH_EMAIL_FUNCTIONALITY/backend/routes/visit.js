import express from "express";
import Visit from "../models/Visit.js"; // make sure this path is correct

const router = express.Router();

// Route to increment visit count
router.get("/", async (req, res) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) {
      visit = await Visit.create({ count: 1 });
    } else {
      visit.count += 1;
      await visit.save();
    }
    res.status(200).json({ message: "Visit counted", count: visit.count });
  } catch (error) {
    console.error("Error tracking visit:", error);
    res.status(500).json({ message: "Error tracking visit" });
  }
});

// Route to view the visit count only
router.get("/count", async (req, res) => {
  try {
    const visit = await Visit.findOne();
    res.status(200).json({ count: visit?.count || 0 });
  } catch (error) {
    console.error("Error fetching visit count:", error);
    res.status(500).json({ message: "Error fetching visit count" });
  }
});

export default router;
