// backend/controllers/auth/jobSeekerProfileController.js
const JobSeekerProfile = require("../../models/jobSeekerProfileModel");

/**
 * GET /api/jobseeker/profile
 * Retrieves the job seeker's profile. Creates a default profile if none exists.
 */
const getProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    let results = await JobSeekerProfile.getProfileByUserId(userId);

    if (results.length === 0) {
      // Profile doesn't exist, create a default profile
      await JobSeekerProfile.createProfile({
        user_id: userId,
        name: "",
        location: "",
        primary_role: "",
        experience: "",
        open_roles: "",
        bio: "",
        skills: "",
        resume: "",
        linkedin: "",
        github: "",
        twitter: "",
        website: "",
        work_experience: [], // Store as empty array
        education: {}, // Store as empty object
        achievements: "",
      });

      // Fetch the newly created profile
      results = await JobSeekerProfile.getProfileByUserId(userId);
    }

    const profile = results[0];

    // Ensure work_experience and education are not null
    profile.work_experience = profile.work_experience || [];
    profile.education = profile.education || {};

    res.status(200).json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * PUT /api/jobseeker/profile
 * Updates the job seeker's profile.
 */
const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    location,
    primaryRole,
    experience,
    openRoles,
    bio,
    skills,
    resume,
    linkedin,
    github,
    twitter,
    website,
    workExperience,
    education,
    achievements,
  } = req.body;

  // Prepare skills as a comma-separated string
  const skillsString = typeof skills === "string" ? skills : skills.join(", ");

  // Prepare workExperience and education as JSON
  const workExperienceData = Array.isArray(workExperience)
    ? workExperience
    : [];
  const educationData =
    typeof education === "object" && education !== null ? education : {};

  const profileData = {
    name,
    location,
    primary_role: primaryRole,
    experience,
    open_roles: openRoles,
    bio,
    skills: skillsString,
    resume,
    linkedin,
    github,
    twitter,
    website,
    work_experience: workExperienceData, // Store as JSON array
    education: educationData, // Store as JSON object
    achievements,
  };

  try {
    const results = await JobSeekerProfile.getProfileByUserId(userId);

    if (results.length === 0) {
      // Profile doesn't exist, create one
      await JobSeekerProfile.createProfile({
        user_id: userId,
        ...profileData,
      });

      // Fetch the newly created profile
      const newResults = await JobSeekerProfile.getProfileByUserId(userId);
      const newProfile = newResults[0];

      // Ensure work_experience and education are not null
      newProfile.work_experience = newProfile.work_experience || [];
      newProfile.education = newProfile.education || {};

      res.status(200).json({
        message: "Profile created successfully",
        profile: newProfile,
      });
    } else {
      // Update existing profile
      await JobSeekerProfile.updateProfile(userId, profileData);

      // Fetch the updated profile
      const updatedResults = await JobSeekerProfile.getProfileByUserId(userId);
      const updatedProfile = updatedResults[0];

      // Ensure work_experience and education are not null
      updatedProfile.work_experience = updatedProfile.work_experience || [];
      updatedProfile.education = updatedProfile.education || {};

      res.status(200).json({
        message: "Profile updated successfully",
        profile: updatedProfile,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
