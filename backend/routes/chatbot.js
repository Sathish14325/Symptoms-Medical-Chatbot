const express = require("express");
const axios = require("axios");
const ChatSession = require("../models/ChatSession");

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { question, sessionId } = req.body;

  if (!question || !sessionId) {
    return res.status(400).json({ error: "Missing question or sessionId" });
  }

  try {
    const flaskResponse = await axios.post("http://localhost:1000/ask", {
      question,
    });

    const answer = flaskResponse.data.answer;

    // Save to DB
    await ChatSession.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          messages: [
            { sender: "user", text: question },
            { sender: "bot", text: answer },
          ],
        },
      },
      { upsert: true, new: true }
    );

    res.json({ answer });
  } catch (err) {
    console.error("Error forwarding to Flask API:", err.message);
    res.status(500).json({ error: "Failed to get response from AI backend" });
  }
});

// Fetch previous messages
router.get("/history/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const session = await ChatSession.findOne({ sessionId });
  res.json(session?.messages || []);
});

// Add to chatbot.route.js

router.get("/sessions", async (req, res) => {
  try {
    const sessions = await ChatSession.find({}, "sessionId createdAt").sort({
      createdAt: -1,
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// Rename session
router.put("/sessions/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const { newTitle } = req.body;

  if (!newTitle) {
    return res.status(400).json({ error: "New title is required" });
  }

  try {
    const session = await ChatSession.findOneAndUpdate(
      { sessionId },
      { title: newTitle },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ success: true, title: session.title });
  } catch (err) {
    console.error("Rename session error:", err);
    res.status(500).json({ error: "Failed to rename session" });
  }
});

module.exports = router;
