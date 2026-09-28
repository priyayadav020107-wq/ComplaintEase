const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT sent in the Authorization header and attaches
// the logged-in user to req.user. Blocks the request if the token
// is missing or invalid.
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid or expired" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token provided" });
};

// Restricts a route to admins only. Must be used AFTER `protect`.
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied: admin only" });
};

module.exports = { protect, adminOnly };
