// routes/authRoutes.js
const express = require("express");
// const { signup, login } = require("../controllers/auth/jobseekerAuth");

const { signup, login } = require("../controllers/auth/jobseekerAuth");
const router = express.Router();

// Job Seeker Routes
router.post("/jobseeker/signup", signup);
router.post("/jobseeker/login", login);

module.exports = router;
