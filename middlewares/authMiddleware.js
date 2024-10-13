// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const JobSeeker = require("../models/jobSeekerModel");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Get token from header
    token = req.headers.authorization.split(" ")[1];
    console.log("Received Token:", token); // Debugging

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Debugging

      // Get user from the token
      JobSeeker.findById(decoded.id, (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return res
            .status(401)
            .json({ message: "Not authorized, database error" });
        }

        if (results.length === 0) {
          console.log("User not found");
          return res
            .status(401)
            .json({ message: "Not authorized, user not found" });
        }

        const user = results[0]; // Extract the user object from the results array
        req.user = user; // Attach the user object to the request
        next();
      });
    } catch (error) {
      console.error("Token Verification Error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
