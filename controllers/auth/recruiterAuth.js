// backend/controllers/auth/recruiterAuth.js
const Recruiter = require("../../models/recruiterModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_RECRUITER, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const registerRecruiter = (req, res) => {
  const { name, username, email, phone, password } = req.body;

  if (!name || !username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields" });
  }

  Recruiter.findByUsername(username, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error" });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    Recruiter.create(
      { name, username, email, phone, password },
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Server Error" });
        }

        const recruiterId = result.insertId;
        const token = generateToken(recruiterId);

        res.status(201).json({
          message: "Recruiter registered successfully",
          token,
          recruiter: {
            id: recruiterId,
            name,
            username,
            email,
          },
        });
      }
    );
  });
};

const loginRecruiter = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields" });
  }

  Recruiter.findByUsername(username, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const recruiter = results[0];

    Recruiter.comparePassword(password, recruiter.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const token = generateToken(recruiter.id);

      res.status(200).json({
        message: "Logged in successfully",
        token,

        recruiter: {
          id: recruiter.id,
          name: recruiter.name,
          username: recruiter.username,
          email: recruiter.email,
        },
      });
    });
  });
};

module.exports = {
  registerRecruiter,
  loginRecruiter,
};
