const db = require("../config/dbConfig");
const util = require("util");

// Promisify the db.query method for easier async/await usage
const query = util.promisify(db.query).bind(db);

const JobSeekerProfile = {
  /**
   * Fetches a job seeker's profile by their user ID.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Array>} - Resolves with the profile data.
   */
  getProfileByUserId: async (userId) => {
    const sql = "SELECT * FROM job_seeker_profiles WHERE user_id = ?";
    const results = await query(sql, [userId]);
    return results;
  },

  /**
   * Creates a new job seeker's profile.
   * @param {object} data - The profile data.
   * @returns {Promise<object>} - Resolves with the result of the insert operation.
   */
  createProfile: async (data) => {
    const {
      user_id,
      name,
      location,
      primary_role,
      experience,
      open_roles,
      bio,
      skills,
      resume,
      linkedin,
      github,
      twitter,
      website,
      work_experience,
      education,
      achievements,
    } = data;

    if (!user_id) {
      throw new Error("User ID cannot be null");
    }

    const sql = `
      INSERT INTO job_seeker_profiles 
      (user_id, name, location, primary_role, experience, open_roles, bio, skills, resume, linkedin, github, twitter, website, work_experience, education, achievements)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Convert arrays/objects to JSON strings where necessary
    const skillsString = Array.isArray(skills) ? skills.join(", ") : skills;
    const workExperienceJSON = work_experience
      ? JSON.stringify(work_experience)
      : JSON.stringify([]);
    const educationJSON = education
      ? JSON.stringify(education)
      : JSON.stringify({});
    const achievementsText = achievements || "";

    const values = [
      user_id,
      name || "",
      location || "",
      primary_role || "",
      experience || "",
      open_roles || "",
      bio || "",
      skillsString,
      resume || "",
      linkedin || "",
      github || "",
      twitter || "",
      website || "",
      workExperienceJSON,
      educationJSON,
      achievementsText,
    ];

    const result = await query(sql, values);
    return result;
  },

  /**
   * Updates an existing job seeker's profile.
   * @param {number} userId - The ID of the user.
   * @param {object} data - The profile data to update.
   * @returns {Promise<object>} - Resolves with the result of the update operation.
   */
  updateProfile: async (userId, data) => {
    const {
      name,
      location,
      primary_role,
      experience,
      open_roles,
      bio,
      skills,
      resume,
      linkedin,
      github,
      twitter,
      website,
      work_experience,
      education,
      achievements,
    } = data;

    const sql = `
      UPDATE job_seeker_profiles 
      SET 
        name = ?, 
        location = ?, 
        primary_role = ?, 
        experience = ?, 
        open_roles = ?, 
        bio = ?, 
        skills = ?, 
        resume = ?, 
        linkedin = ?, 
        github = ?, 
        twitter = ?, 
        website = ?, 
        work_experience = ?, 
        education = ?, 
        achievements = ?
      WHERE user_id = ?
    `;

    // Convert arrays/objects to JSON strings where necessary
    const skillsString = Array.isArray(skills) ? skills.join(", ") : skills;
    const workExperienceJSON = work_experience
      ? JSON.stringify(work_experience)
      : JSON.stringify([]);
    const educationJSON = education
      ? JSON.stringify(education)
      : JSON.stringify([]); // Default to empty array
    const achievementsText = achievements || "";

    const values = [
      name || "",
      location || "",
      primary_role || "",
      experience || "",
      open_roles || "",
      bio || "",
      skillsString,
      resume || "",
      linkedin || "",
      github || "",
      twitter || "",
      website || "",
      workExperienceJSON,
      educationJSON, // Use updated educationJSON
      achievementsText,
      userId,
    ];

    const result = await query(sql, values);
    return result;
  },
};

module.exports = JobSeekerProfile;
