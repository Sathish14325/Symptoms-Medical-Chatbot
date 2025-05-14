// routes/heartRoutes.js
const express = require("express");
const router = express.Router();
const { predictHeartDisease } = require("../controllers/heartController");

router.post("/predict", predictHeartDisease);

module.exports = router;
