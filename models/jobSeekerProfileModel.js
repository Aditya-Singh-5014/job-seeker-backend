// backend/models/jobSeekerProfileModel.js
const db = require("../config/dbConfig");

const JobSeekerProfile = {
  getProfileByUserId: (userId, callback) => {
    const query = `SELECT * FROM job_seeker_profiles WHERE user_id = ?`;
    db.query(query, [userId], callback);
  },
  createProfile: (data, callback) => {
    const { user_id, bio, skills, resume } = data;

    // Ensuring user_id is passed correctly
    if (!user_id) {
      return callback(new Error("User ID cannot be null"));
    }

    const sql =
      "INSERT INTO job_seeker_profiles (user_id, bio, skills, resume) VALUES (?, ?, ?, ?)";
    db.query(sql, [user_id, bio, skills, resume], (err, result) => {
      if (err) {
        console.error("Error inserting profile:", err);
        return callback(err);
      }
      callback(null, result);
    });
  },
  updateProfile: (userId, profileData, callback) => {
    const query = `UPDATE job_seeker_profiles SET bio = ?, skills = ?, resume = ? WHERE user_id = ?`;
    db.query(
      query,
      [
        profileData.bio || "",
        profileData.skills ? profileData.skills.join(", ") : "",
        profileData.resume || "",
        userId,
      ],
      callback
    );
  },
};

module.exports = JobSeekerProfile;
