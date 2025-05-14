const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const healthPredict = require("./routes/healthPredict");
const promptHistoryRoutes = require("./routes/promptHistory");
const authMiddleware = require("./middleware/authMiddleware");
const heartRoutes = require("./routes/heartRoutes");
const findDoctorRoute = require("./routes/findDoctorRoute");
// chatbot
const chatbotRoutes = require("./routes/chatbot");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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
app.use("/api/predict-diabetes", require("./routes/diabetes"));
app.use("/api/predict-kidney", require("./routes/kidneyPrediction"));
app.use("/api/predict-heart", heartRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/find-doctor", findDoctorRoute);

// chatbot session
app.use(
  session({
    secret: "yourSuperSecretKey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/mediai_chatbot",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Medical chatbot API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
