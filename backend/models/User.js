const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    age: Number,
    weight: Number,
    height: Number,
    gender: String,
    phone: String,
    address: String,
    pincode: String,
    city: String,
    state: String,
    photo: String, // store photo file name or URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
