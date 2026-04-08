const express = require("express");
const protect = require("../middleware/auth");
const { getCurrentUser, login } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getCurrentUser);

module.exports = router;
