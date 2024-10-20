// backend/controllers/jobController.js
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");

const getAllJobs = async (req, res) => {
  try {
    const { keyword = '', jobType = '', category = '' } = req.query;

    const jobs = await Job.searchJobs(keyword, jobType, category);
    res.status(200).json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const applyToJob = async (req, res) => {
  const jobId = req.params.id;
  const jobSeekerId = req.user.id;
  const { coverLetter } = req.body;

  try {
    const existingApplications = await Application.checkExistingApplication(
      jobId,
      jobSeekerId
    );
    if (existingApplications.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job" });
    }

    await Application.applyToJob(jobId, jobSeekerId, coverLetter);
    res.status(200).json({ message: "Applied to job successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAppliedJobs = async (req, res) => {
  const jobSeekerId = req.user.id;

  try {
    const appliedJobs = await Application.getAppliedJobsByJobSeekerId(jobSeekerId);
    res.status(200).json({ appliedJobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllJobs,
  applyToJob,
  getAppliedJobs, // Add this line
};

