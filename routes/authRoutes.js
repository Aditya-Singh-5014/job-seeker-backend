// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerJobSeeker,
  loginJobSeeker,
} = require("../controllers/auth/jobseekerauth");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile/jobSeekerProfileController");
const { protect } = require("../middlewares/authMiddleware");

// Authentication Routes
router.post("/jobseeker/signup", registerJobSeeker);
router.post("/jobseeker/login", loginJobSeeker);

// Profile Routes (Protected)
router.get("/jobseeker/profile", protect, getProfile);
router.put("/jobseeker/profile", protect, updateProfile);

module.exports = router;
