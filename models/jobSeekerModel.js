// backend/models/jobSeekerModel.js
const db = require("../config/dbConfig");
const bcrypt = require("bcryptjs");

const JobSeeker = {
  create: (userData, callback) => {
    const query = `INSERT INTO job_seekers (name, username, email, phone, password) VALUES (?, ?, ?, ?, ?)`;
    // Hash the password before storing
    bcrypt.hash(userData.password, 10, (err, hash) => {
      if (err) return callback(err);
      db.query(
        query,
        [
          userData.name,
          userData.username,
          userData.email,
          userData.phone,
          hash,
        ],
        callback
      );
    });
  },

  findByUsername: (username, callback) => {
    const query = `SELECT * FROM job_seekers WHERE username = ?`;
    db.query(query, [username], callback);
  },

  findById: (id, callback) => {
    const query = `SELECT * FROM job_seekers WHERE id = ?`;
    db.query(query, [id], callback);
  },

  comparePassword: (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  },
};

module.exports = JobSeeker;
