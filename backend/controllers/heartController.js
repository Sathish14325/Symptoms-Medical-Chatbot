// controllers/heartController.js
const axios = require("axios");

exports.predictHeartDisease = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:1000/api/predict-heart",
      req.body
    );
    res.status(200).json({
      success: true,
      prediction: response.data.prediction,
    });
  } catch (error) {
    console.error("Error predicting heart disease:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get prediction from Python API",
    });
  }
};
