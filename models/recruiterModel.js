// backend/models/recruiterModel.js
const db = require("../config/dbConfig");
const bcrypt = require("bcryptjs");

const Recruiter = {
  create: (userData, callback) => {
    const query = `INSERT INTO recruiters (name, username, email, phone, password) VALUES (?, ?, ?, ?, ?)`;
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
    const query = `SELECT * FROM recruiters WHERE username = ?`;
    db.query(query, [username], callback);
  },

  findById: (id, callback) => {
    const query = `SELECT * FROM recruiters WHERE id = ?`;
    db.query(query, [id], callback);
  },

  comparePassword: (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  },
};

module.exports = Recruiter;
