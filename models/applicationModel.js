const db = require("../config/dbConfig");
const util = require("util");

const query = util.promisify(db.query).bind(db);

const Application = {
  applyToJob: async (jobId, jobSeekerId, coverLetter) => {
    const sql = `
      INSERT INTO applications (job_id, jobseeker_id, status, date_applied, cover_letter)
      VALUES (?, ?, 'applied', NOW(), ?)
    `;
    const result = await query(sql, [jobId, jobSeekerId, coverLetter]);
    return result;
  },


  getAppliedJobsByJobSeekerId: async (jobSeekerId) => {
    const sql = `
      SELECT jobs.*, applications.date_applied
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.jobseeker_id = ?
    `;
    const results = await query(sql, [jobSeekerId]);
    return results;
  },

  checkExistingApplication: async (jobId, jobSeekerId) => {
    const sql = `SELECT * FROM applications WHERE job_id = ? AND jobseeker_id = ?`;
    const results = await query(sql, [jobId, jobSeekerId]);
    return results;
  },
};

module.exports = Application;
