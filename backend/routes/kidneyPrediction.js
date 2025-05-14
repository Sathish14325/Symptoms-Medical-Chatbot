const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /api/predict-kidney
router.post("/predict", async (req, res) => {
  try {
    const flaskUrl = "http://localhost:1000/api/predict-kidney"; // Flask endpoint

    const response = await axios.post(flaskUrl, req.body);

    res.status(200).json(response.data); // return Flask response to frontend
  } catch (err) {
    console.error("Error calling Flask API:", err.message);
    res.status(500).json({
      error: "Error calling kidney prediction API",
      details: err.message,
    });
  }
});

module.exports = router;
