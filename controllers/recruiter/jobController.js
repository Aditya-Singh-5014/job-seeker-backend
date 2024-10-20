// backend/controllers/recruiter/jobController.js
const Job = require("../../models/jobModel");
const Application = require("../../models/applicationModel");

const createJob = async (req, res) => {
  const recruiterId = req.recruiter.id;
  const { title, description, location, requirements, salary, job_type, category } = req.body;

  if (!title || !description || !job_type || !category) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  const jobData = {
    recruiter_id: recruiterId,
    title,
    description,
    location,
    requirements,
    salary,
    job_type,
    category,
  };

  try {
    const result = await Job.createJob(jobData);
    const jobId = result.insertId;
    res.status(201).json({ message: "Job created successfully", jobId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getRecruiterJobs = async (req, res) => {
  const recruiterId = req.recruiter.id;

  try {
    const jobs = await Job.getJobsByRecruiterId(recruiterId);
    res.status(200).json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getJobApplications = async (req, res) => {
  const jobId = req.params.id;
  const recruiterId = req.recruiter.id;

  try {
    const job = await Job.getJobById(jobId);

    if (!job || job.recruiter_id !== recruiterId) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applications = await Application.getApplicationsByJobId(jobId);
    res.status(200).json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};



module.exports = {
  createJob,
  getRecruiterJobs,
  getJobApplications,
};
