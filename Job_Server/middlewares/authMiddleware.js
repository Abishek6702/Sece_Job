const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// To verify the token passed to endpoints
exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    // console.log("No token provided in authorization header");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded);                                                                    
    if (!decoded.id) {
      // console.log("Decoded token id:", decoded.id);
      throw new Error("Invalid token payload: missing id");
    }

    req.user = {
      _id: decoded.id,
      role: decoded.role,
      connections: decoded.connections || [],
    };
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// To check the user roles to gve access to the endpoints
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || typeof req.user.role !== "string") {
      return res
        .status(401)
        .json({ message: "User role not found or unauthorized." });
    }
    if (
      !roles
        .map((role) => role.toLowerCase())
        .includes(req.user.role.toLowerCase())
    ) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
