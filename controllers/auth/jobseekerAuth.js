// backend/controllers/auth/jobseekerAuth.js
const JobSeeker = require("../../models/jobSeekerModel");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// POST /api/jobseeker/signup
const registerJobSeeker = (req, res) => {
  const { name, username, email, phone, password } = req.body;

  // Simple validation
  if (!name || !username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields" });
  }

  // Check if user exists by username
  JobSeeker.findByUsername(username, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create user
    JobSeeker.create(
      { name, username, email, phone, password },
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server Error" });
        }

        // Get the inserted user ID
        const userId = result.insertId;

        // Generate token
        const token = generateToken(userId);

        res.status(201).json({
          message: "User registered successfully",
          token,
          user: {
            id: userId,
            name,
            username,
            email,
          },
        });
      }
    );
  });
};

// POST /api/jobseeker/login
const loginJobSeeker = (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields" });
  }

  // Check for user by username
  JobSeeker.findByUsername(username, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const user = results[0];

    // Check password
    JobSeeker.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      // Generate token
      const token = generateToken(user.id);

      res.status(200).json({
        message: "Logged in successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      });
    });
  });
};

module.exports = {
  registerJobSeeker,
  loginJobSeeker,
};
