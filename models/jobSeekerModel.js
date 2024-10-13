// models/jobSeekerModel.js
const db = require("../config/dbConfig");

const JobSeeker = {
  create: (userData, callback) => {
    const query = `INSERT INTO job_seekers (name, username, email, phone, password) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      query,
      [
        userData.name,
        userData.username,
        userData.email,
        userData.phone,
        userData.password,
      ],
      callback
    );
  },
  findByUsername: (username, callback) => {
    const query = `SELECT * FROM job_seekers WHERE username = ?`;
    db.query(query, [username], callback);
  },
};

module.exports = JobSeeker;
