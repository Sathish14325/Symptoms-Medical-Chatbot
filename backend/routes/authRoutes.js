const express = require("express");
const router = express.Router();
const multer = require("multer");
const { register, login } = require("../controllers/authController");

// Multer config for image upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/register", upload.single("photo"), register);
router.post("/login", login);

module.exports = router;
