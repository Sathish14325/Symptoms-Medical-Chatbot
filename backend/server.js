const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const promptHistoryRoutes = require("./routes/promptHistory");
const authMiddleware = require("./middleware/authMiddleware");
const findDoctorRoute = require("./routes/findDoctorRoute");
const healthPredict = require("./routes/healthPredict");
// chatbot
const chatbotRoutes = require("./routes/chatbot");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const allowedOrigins = [
  "https://medical-chatbot-olive.vercel.app",
  "http://localhost:5173",
];

const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // only if using cookies/auth
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded images

app.use("/api/auth", authRoutes);
app.use("/api/healthPredict", healthPredict);
app.use("/api/history", promptHistoryRoutes);
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
