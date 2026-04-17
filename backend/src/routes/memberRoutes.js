const express = require("express");
const protect = require("../middleware/auth");
const {
  createMember,
  deleteMember,
  getDueMembers,
  getMembers,
  sendAllMemberReminders,
  sendMemberReminder,
  toggleMemberStatus,
  togglePayment,
  updateMember,
} = require("../controllers/memberController");

const router = express.Router();

router.use(protect);

router.get("/", getMembers);
router.get("/due-members", getDueMembers);
router.post("/", createMember);
router.post("/reminders/send-all", sendAllMemberReminders);
router.post("/:id/reminders", sendMemberReminder);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);
router.patch("/:id/status", toggleMemberStatus);
router.patch("/:id/payments", togglePayment);

module.exports = router;
