const express = require("express");
const router = express.Router();
const PromptHistory = require("../models/PromptHistory");
const protect = require("../middleware/authMiddleware"); // your JWT guard

/**
 * POST /api/history
 * Body: { query: "...", answer: "..." }
 */
router.post("/", protect, async (req, res) => {
  try {
    const { query, answer } = req.body;
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const newHistory = new PromptHistory({
      userId, // ✅ This matches the schema field name
      query,
      answer,
    });

    await newHistory.save();
    console.log("✅ History Saved");

    res.status(201).json({ message: "History saved successfully" });
  } catch (error) {
    console.error("Error saving history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/history
 * Returns the current user’s history, newest first
 */
router.get("/", protect, async (req, res) => {
  try {
    const history = await PromptHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(history);
  } catch (err) {
    console.error("Fetch history error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
