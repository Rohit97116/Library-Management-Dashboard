const express = require("express");
const protect = require("../middleware/auth");
const {
  createMember,
  deleteMember,
  getDueMembers,
  getMembers,
  logWhatsAppReminder,
  toggleMemberStatus,
  togglePayment,
  updateMember,
} = require("../controllers/memberController");

const router = express.Router();

router.use(protect);

router.get("/", getMembers);
router.get("/due-members", getDueMembers);
router.post("/", createMember);
router.post("/:id/reminders/whatsapp", logWhatsAppReminder);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);
router.patch("/:id/status", toggleMemberStatus);
router.patch("/:id/payments", togglePayment);

module.exports = router;
