// models/ChatSession.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  isButton: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  messages: [messageSchema],
  title: { type: String, default: "Untitled Session" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatSession", sessionSchema);
