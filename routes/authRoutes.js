// backend/routes/authRoutes.js
const express = require("express");
const { getAppliedJobs } = require('../controllers/jobController');
const router = express.Router();
const {
  registerJobSeeker,
  loginJobSeeker,
} = require("../controllers/auth/jobseekerAuth");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile/jobSeekerProfileController");
const { protect } = require("../middlewares/authMiddleware");
const { getAllJobs, applyToJob } = require("../controllers/jobController");

// Authentication Routes
router.post("/jobseeker/signup", registerJobSeeker);
router.post("/jobseeker/login", loginJobSeeker);

// Profile Routes (Protected)
router.get("/jobseeker/profile", protect, getProfile);
router.put("/jobseeker/profile", protect, updateProfile);

// Job Routes
router.get("/jobs", getAllJobs); // Public
router.post("/jobs/:id/apply", protect, applyToJob); // Protected


// Applied Jobs Route (Protected)
router.get('/jobseeker/applied-jobs', protect, getAppliedJobs);

module.exports = router;
