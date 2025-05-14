// models/Prediction.js

const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptoms: {
      type: [String],
      required: true,
    },
    disease: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    precautions: {
      type: [String],
    },
    medications: {
      type: [String],
    },
    diet: {
      type: [String],
    },
    workout: {
      type: [String],
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt fields
  }
);

module.exports = mongoose.model("Prediction", predictionSchema);
