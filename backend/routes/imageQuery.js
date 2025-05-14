const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const History = require("../models/History");
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

// POST /api/image-query
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user?._id || req.user?.id;
    // Assuming JWT middleware has attached user
    console.log("User ID:", userId);
    console.log("Query:", query);
    if (!req.file || !query || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const imagePath = req.file.path;
    console.log("Image Path:", imagePath);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const messages = [
      {
        role: "user",
        content: [
          { type: "text", text: query },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ];

    // Call your Python API
    const response = await axios.post(
      "http://localhost:8001/upload_and_query",
      {
        model: "meta-llama/llama-4-maverick-17b-128e-instruct",
        messages,
        max_tokens: 1000,
      }
    );
    console.log("Python API response:", response.data);

    const maverick = response.data?.maverick;

    // Save to MongoDB
    const history = new History({
      userId,
      imagePath,
      query,
      response: maverick,
    });
    console.log(history);
    await history.save();
    await history.save();
    console.log("History saved to DB");

    res.status(200).json({ success: true, data: history });
  } catch (err) {
    console.error("Error uploading and saving image query:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
