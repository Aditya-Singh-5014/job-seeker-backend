// backend/controllers/auth/jobSeekerProfileController.js
const JobSeekerProfile = require("../../models/jobSeekerProfileModel");

// GET /api/jobseeker/profile
const getProfile = (req, res) => {
  const userId = req.user.id;

  JobSeekerProfile.getProfileByUserId(userId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error" });
    }

    if (results.length === 0) {
      // Profile doesn't exist, create a default profile
      JobSeekerProfile.createProfile(
        { user_id: userId, bio: "", skills: [], resume: "" },
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
          }
          // Fetch the newly created profile
          JobSeekerProfile.getProfileByUserId(userId, (err, results) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Server Error" });
            }
            res.status(200).json({ profile: results[0] });
          });
        }
      );
    } else {
      res.status(200).json({ profile: results[0] });
    }
  });
};

// PUT /api/jobseeker/profile
const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { bio, skills, resume } = req.body;

  // Prepare skills as an array if it's a string
  let skillsArray = [];
  if (typeof skills === "string") {
    skillsArray = skills.split(",").map((skill) => skill.trim());
  } else if (Array.isArray(skills)) {
    skillsArray = skills;
  }

  const profileData = {
    bio: bio || "",
    skills: skillsArray,
    resume: resume || "",
  };

  // Check if profile exists
  JobSeekerProfile.getProfileByUserId(userId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error" });
    }

    if (results.length === 0) {
      // Profile doesn't exist, create one
      JobSeekerProfile.createProfile(
        { user_id: userId, ...profileData },
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
          }
          // Fetch the newly created profile
          JobSeekerProfile.getProfileByUserId(userId, (err, results) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Server Error" });
            }
            res.status(200).json({
              message: "Profile created successfully",
              profile: results[0],
            });
          });
        }
      );
    } else {
      // Update existing profile
      JobSeekerProfile.updateProfile(userId, profileData, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server Error" });
        }
        // Fetch the updated profile
        JobSeekerProfile.getProfileByUserId(userId, (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
          }
          res.status(200).json({
            message: "Profile updated successfully",
            profile: results[0],
          });
        });
      });
    }
  });
};

module.exports = {
  getProfile,
  updateProfile,
};
