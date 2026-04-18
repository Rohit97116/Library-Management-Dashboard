const Member = require("../models/Member");
const ReminderLog = require("../models/ReminderLog");
const { buildMemberCycle, getFiscalCycleYear } = require("../utils/cycle");
const { getPrimaryAdminProfile } = require("./adminProfileService");

async function buildReminderState() {
  const logs = await ReminderLog.find({}).sort({ sentAt: -1 }).lean();
  const latestByMemberId = new Map();

  logs.forEach((log) => {
    const memberId = String(log.member);
    if (!latestByMemberId.has(memberId)) {
      latestByMemberId.set(memberId, log);
    }
  });

  return {
    latestByMemberId,
  };
}

function buildDueMemberEntry(member, cycleSnapshot, adminProfile, reminderMeta) {
  const overdueMonths = cycleSnapshot.months.filter((month) => month.isOverdue);
  if (!overdueMonths.length) {
    return null;
  }

  const firstDueMonth = overdueMonths[0];
  const phoneNumber = member.phoneNumber || member.phone || "";
  const dueDate = new Date(firstDueMonth.dueDate);
  const latestReminder = reminderMeta.latestReminder || null;

  return {
    memberId: String(member._id),
    name: member.name,
    phoneNumber,
    monthlyFee: member.monthlyFee,
    dueDate: dueDate.toISOString(),
    overdueCount: overdueMonths.length,
    overdueAmount: overdueMonths.length * member.monthlyFee,
    cycleYear: cycleSnapshot.cycleYear,
    cycleLabel: cycleSnapshot.cycleLabel,
    monthKeys: overdueMonths.map((month) => month.key),
    lastReminderAt: latestReminder?.sentAt || null,
    reminderStatus: phoneNumber
      ? latestReminder?.status === "sent"
        ? "recently-sent"
        : "pending"
      : "missing-phone",
    canSendReminder: Boolean(phoneNumber),
    // WhatsApp reminders are sent client-side, no message building needed here
  };
}

async function checkDueMembers({
  members,
  referenceDate = new Date(),
  adminProfile,
} = {}) {
  const memberRecords =
    members || (await Member.find({}).sort({ createdAt: 1, _id: 1 }));
  const profile = adminProfile || (await getPrimaryAdminProfile());
  const reminderState = await buildReminderState();
  const cycleYear = getFiscalCycleYear(referenceDate);

  return memberRecords
    .map((member) => {
      const cycleSnapshot = buildMemberCycle(member, referenceDate, cycleYear);
      const memberId = String(member._id);

      return buildDueMemberEntry(member, cycleSnapshot, profile, {
        latestReminder: reminderState.latestByMemberId.get(memberId),
      });
    })
    .filter(Boolean);
}

/**
 * Log reminder action for audit trail
 * (Optional - for recording when reminders are sent)
 */
async function logReminderAction(memberId, dueEntry, referenceDate = new Date()) {
  try {
    await ReminderLog.create({
      member: memberId,
      cycleYear: dueEntry.cycleYear,
      monthKeys: dueEntry.monthKeys,
      dueDate: new Date(dueEntry.dueDate),
      memberName: dueEntry.name,
      phoneNumber: dueEntry.phoneNumber,
      message: "WhatsApp reminder sent via client",
      provider: "whatsapp",
      simulated: false,
      status: "sent",
      triggeredBy: "manual",
      sentAt: referenceDate,
    });
  } catch (error) {
    // Silently fail - logging is not critical
    console.error("Failed to log reminder:", error);
  }
}

module.exports = {
  checkDueMembers,
  logReminderAction,
};
