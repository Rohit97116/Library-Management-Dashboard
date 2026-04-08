const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    res.status(401);
    return next(new Error("Authentication required."));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      return next(new Error("User account was not found."));
    }

    req.user = user;
    return next();
  } catch (error) {
    res.status(401);
    return next(new Error("Your session is invalid or has expired."));
  }
}

module.exports = protect;
