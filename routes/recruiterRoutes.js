// backend/routes/recruiterRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerRecruiter,
  loginRecruiter,
} = require("../controllers/auth/recruiterAuth");
const {
  createJob,
  getRecruiterJobs,
  getJobApplications,
} = require("../controllers/recruiter/jobController");
const { protectRecruiter } = require("../middlewares/recruiterAuthMiddleware");

// Authentication Routes
router.post("/recruiter/signup", registerRecruiter);
router.post("/recruiter/login", loginRecruiter);

// Job Routes (Protected)
router.post("/recruiter/jobs", protectRecruiter, createJob);
router.get("/recruiter/jobs", protectRecruiter, getRecruiterJobs);
router.get(
  "/recruiter/jobs/:id/applications",
  protectRecruiter,
  getJobApplications
);

module.exports = router;
