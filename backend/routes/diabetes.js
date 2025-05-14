const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    const inputData = req.body;

    // Send named fields to Flask API exactly as expected
    const response = await axios.post(
      "http://localhost:1000/api/diabetes",
      inputData
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error calling Flask API:", error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
