const express = require("express");
const protect = require("../middleware/auth");
const {
  createMember,
  deleteMember,
  getMembers,
  toggleMemberStatus,
  togglePayment,
  updateMember,
} = require("../controllers/memberController");

const router = express.Router();

router.use(protect);

router.get("/", getMembers);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);
router.patch("/:id/status", toggleMemberStatus);
router.patch("/:id/payments", togglePayment);

module.exports = router;
