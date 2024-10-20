// backend/models/jobModel.js
const db = require("../config/dbConfig");
const util = require("util");

const query = util.promisify(db.query).bind(db);

const Job = {
  createJob: async (jobData) => {
    const {
      recruiter_id,
      title,
      description,
      location,
      requirements,
      salary,
      job_type,    // Add this
      category,    // For point 3
    } = jobData;
  
    const sql = `
      INSERT INTO jobs (recruiter_id, title, description, location, requirements, salary, job_type, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      recruiter_id,
      title,
      description,
      location,
      requirements,
      salary,
      job_type,
      category,
    ];
  
    const result = await query(sql, values);
    return result;
  },

  searchJobs: async (keyword, jobType, category) => {
    let sql = `SELECT * FROM jobs WHERE 1=1`;
    const params = [];
  
    if (jobType) {
      sql += ` AND job_type = ?`;
      params.push(jobType);
    }
  
    if (category) {
      sql += ` AND category LIKE ?`;
      params.push(`%${category}%`);
    }
  
    if (keyword) {
      sql += ` AND (title LIKE ? OR category LIKE ? OR description LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
  
    const results = await query(sql, params);
    return results;
  },

  getJobsByRecruiterId: async (recruiterId) => {
    const sql = `SELECT * FROM jobs WHERE recruiter_id = ?`;
    const results = await query(sql, [recruiterId]);
    return results;
  },

  getAllJobs: async () => {
    const sql = `SELECT * FROM jobs`;
    const results = await query(sql);
    return results;
  },

  getJobById: async (jobId) => {
    const sql = `SELECT * FROM jobs WHERE id = ?`;
    const results = await query(sql, [jobId]);
    return results[0];
  },
};

module.exports = Job;
