const express = require("express");
const axios = require("axios");
const router = express.Router();
const Prediction = require("../models/Prediction");
const auth = require("../middleware/authMiddleware");

// POST /api/healthPredict/predict
router.post("/predict", auth, async (req, res) => {
  try {
    const { symptoms } = req.body;
    const userId = req.user.id;

    // Send symptoms to ML model/microservice
    const response = await axios.post("http://localhost:1000/api/predict", {
      symptoms,
    });

    const result = response.data;

    // Save to MongoDB
    const newPrediction = new Prediction({
      userId,
      symptoms,
      disease: result.disease,
      description: result.description,
      precautions: result.precautions,
      medications: result.medications,
      diet: result.diet,
      workout: result.workout,
    });

    await newPrediction.save();

    res.json(result);
  } catch (error) {
    console.error("Prediction error:", error.message);
    res.status(500).json({ error: "Prediction failed" });
  }
});

// GET /api/healthPredict/history
router.get("/history", auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(predictions);
  } catch (error) {
    console.error("Fetch history error:", error.message);
    res.status(500).json({ error: "Failed to fetch prediction history" });
  }
});

module.exports = router;
