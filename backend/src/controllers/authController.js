const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

function createToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

const login = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim().toLowerCase();
  const password = req.body.password;

  if (!username || !password) {
    res.status(400);
    throw new Error("Username and password are required.");
  }

  const user = await User.findOne({ username }).select("+passwordHash");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid username or password.");
  }

  res.json({
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
    },
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
    },
  });
});

module.exports = {
  getCurrentUser,
  login,
};
