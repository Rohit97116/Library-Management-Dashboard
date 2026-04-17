const Member = require("../models/Member");
const ReminderLog = require("../models/ReminderLog");
const { buildMemberCycle, getFiscalCycleYear } = require("../utils/cycle");
const { buildReminderMessage, sendReminderSms } = require("./smsService");
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
      ? latestReminder
        ? "recently-sent"
        : "pending"
      : "missing-phone",
    canSendReminder: Boolean(phoneNumber),
    message: buildReminderMessage({
      memberName: member.name,
      libraryName: adminProfile?.libraryName || "Ambey Library",
    }),
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

async function sendReminderForEntry(
  dueEntry,
  { triggeredBy = "manual", referenceDate = new Date() } = {}
) {
  if (!dueEntry) {
    return {
      sent: false,
      skipped: true,
      message: "No pending dues.",
    };
  }

  if (!dueEntry.phoneNumber) {
    return {
      sent: false,
      skipped: true,
      message: `${dueEntry.name} does not have a valid phone number.`,
    };
  }

  const smsResult = await sendReminderSms({
    to: dueEntry.phoneNumber,
    message: dueEntry.message,
  });

  await ReminderLog.create({
    member: dueEntry.memberId,
    cycleYear: dueEntry.cycleYear,
    monthKeys: dueEntry.monthKeys,
    dueDate: new Date(dueEntry.dueDate),
    memberName: dueEntry.name,
    phoneNumber: dueEntry.phoneNumber,
    message: dueEntry.message,
    provider: smsResult.provider,
    simulated: smsResult.simulated,
    status: "sent",
    triggeredBy,
    sentAt: referenceDate,
  });

  return {
    sent: true,
    skipped: false,
    simulated: smsResult.simulated,
    provider: smsResult.provider,
    memberId: dueEntry.memberId,
    message: `Reminder sent successfully to ${dueEntry.name}.`,
  };
}

async function sendReminderToMemberById(memberId, options = {}) {
  const member = await Member.findById(memberId);

  if (!member) {
    return {
      sent: false,
      skipped: true,
      message: "Member not found.",
    };
  }

  const dueMembers = await checkDueMembers({
    members: [member],
    referenceDate: options.referenceDate,
    adminProfile: options.adminProfile,
  });

  return sendReminderForEntry(dueMembers[0], options);
}

async function sendAllDueReminders({
  referenceDate = new Date(),
  adminProfile,
  triggeredBy = "manual",
} = {}) {
  const dueMembers = await checkDueMembers({
    referenceDate,
    adminProfile,
  });

  if (!dueMembers.length) {
    return {
      message: "No pending dues.",
      sentCount: 0,
      skippedCount: 0,
      dueMembers: [],
      results: [],
    };
  }

  const results = [];
  for (const dueEntry of dueMembers) {
    results.push(
      await sendReminderForEntry(dueEntry, {
        triggeredBy,
        referenceDate,
      })
    );
  }

  const sentCount = results.filter((result) => result.sent).length;
  const skippedCount = results.length - sentCount;

  return {
    message:
      sentCount === 0
        ? "No reminders could be sent."
        : sentCount === 1
          ? "Reminder sent successfully."
          : `${sentCount} reminders sent successfully.`,
    sentCount,
    skippedCount,
    dueMembers,
    results,
  };
}

module.exports = {
  checkDueMembers,
  sendAllDueReminders,
  sendReminderForEntry,
  sendReminderToMemberById,
};
