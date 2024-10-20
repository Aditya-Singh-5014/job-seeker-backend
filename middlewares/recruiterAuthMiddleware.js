// backend/middlewares/recruiterAuthMiddleware.js
const jwt = require("jsonwebtoken");
const Recruiter = require("../models/recruiterModel");

const protectRecruiter = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_RECRUITER);

      Recruiter.findById(decoded.id, (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return res
            .status(401)
            .json({ message: "Not authorized, database error" });
        }

        if (results.length === 0) {
          return res
            .status(401)
            .json({ message: "Not authorized, recruiter not found" });
        }

        req.recruiter = results[0];
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

module.exports = { protectRecruiter };
