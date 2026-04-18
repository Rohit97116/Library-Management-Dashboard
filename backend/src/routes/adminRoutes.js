const express = require("express");
const protect = require("../middleware/auth");
const { getAdminProfile, updateAdminProfile } = require("../controllers/adminController");

const router = express.Router();

router.use(protect);
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);

module.exports = router;
