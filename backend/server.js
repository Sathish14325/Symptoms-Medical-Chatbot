const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const healthPredict = require("./routes/healthPredict");
const promptHistoryRoutes = require("./routes/promptHistory");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded images

app.use("/api/auth", authRoutes);
app.use("/api/healthPredict", healthPredict);
app.use("/api/history", promptHistoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
