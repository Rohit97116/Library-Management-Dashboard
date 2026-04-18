const Member = require("../models/Member");
const asyncHandler = require("../utils/asyncHandler");
const {
  DISPLAY_MONTHS,
  buildMemberCycle,
  getCycleLabel,
  getCycleMonthIndex,
  getFiscalCycleYear,
  getMonthKey,
} = require("../utils/cycle");
const {
  ensureAdminProfile,
  serializeAdminProfile,
} = require("../services/adminProfileService");
const {
  checkDueMembers,
  sendAllDueReminders,
  sendReminderToMemberById,
} = require("../services/reminderService");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseMemberPayload(body, options = {}) {
  const { partial = false } = options;
  const payload = {};

  if (!partial || body.name !== undefined) {
    const name = body.name?.trim();
    if (!name) {
      throw new Error("Member name is required.");
    }
    payload.name = name;
  }

  if (!partial || body.dateOfJoining !== undefined || body.joinDate !== undefined) {
    const joiningDate = new Date(body.dateOfJoining ?? body.joinDate);
    if (Number.isNaN(joiningDate.getTime())) {
      throw new Error("A valid joining date is required.");
    }
    payload.dateOfJoining = joiningDate;
  }

  if (!partial || body.monthlyFee !== undefined) {
    const monthlyFee = Number(body.monthlyFee);
    if (!Number.isFinite(monthlyFee) || monthlyFee < 0) {
      throw new Error("Monthly fee must be a valid positive number.");
    }
    payload.monthlyFee = monthlyFee;
  }

  if (!partial || body.status !== undefined) {
    payload.status = body.status === "inactive" ? "inactive" : "active";
  }

  if (!partial || body.phoneNumber !== undefined || body.phone !== undefined) {
    const phoneNumber = (body.phoneNumber ?? body.phone)?.trim();
    if (!phoneNumber) {
      throw new Error("Phone number is required.");
    }

    payload.phoneNumber = phoneNumber;
    payload.phone = phoneNumber;
  }

  return payload;
}

function ensurePaymentMaps(member) {
  if (!member.monthlyFees) {
    member.monthlyFees = new Map();
  }

  if (!member.feeStatus) {
    member.feeStatus = new Map();
  }

  if (!member.payments) {
    member.payments = new Map();
  }
}

function buildDashboardResponse(
  members,
  { referenceDate = new Date(), adminProfile, dueMembers = [] } = {}
) {
  const cycleYear = getFiscalCycleYear(referenceDate);
  const currentMonthIndex = getCycleMonthIndex(referenceDate);
  const dueMemberMap = new Map(
    dueMembers.map((dueEntry) => [dueEntry.memberId, dueEntry])
  );

  const hydratedMembers = members.map((member) => {
    const snapshot = buildMemberCycle(member, referenceDate, cycleYear);
    const overdueCount = snapshot.months.filter((month) => month.isOverdue).length;
    const paidCount = snapshot.months.filter((month) => month.isPaid).length;
    const dueEntry = dueMemberMap.get(String(member._id));

    return {
      id: member._id,
      name: member.name,
      phoneNumber: member.phoneNumber || member.phone,
      phone: member.phoneNumber || member.phone,
      monthlyFee: member.monthlyFee,
      status: member.status,
      dateOfJoining: member.dateOfJoining,
      joinDate: member.dateOfJoining,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
      overdueCount,
      paidCount,
      dueDate: dueEntry?.dueDate || null,
      canSendReminder: Boolean(dueEntry?.canSendReminder),
      reminderStatus: dueEntry?.reminderStatus || "clear",
      reminderLastSentAt: dueEntry?.lastReminderAt || null,
      overdueAmount: dueEntry?.overdueAmount || 0,
      months: snapshot.months,
    };
  });

  const summary = hydratedMembers.reduce(
    (accumulator, member) => {
      accumulator.totalMembers += 1;
      if (member.status === "active") {
        accumulator.activeMembers += 1;
      } else {
        accumulator.inactiveMembers += 1;
      }

      const currentMonth = member.months[currentMonthIndex];
      const applicableMonths = member.months.filter((month) => month.isApplicable);
      const paidMonths = applicableMonths.filter((month) => month.isPaid);

      if (currentMonth?.isApplicable) {
        accumulator.currentMonthExpected += member.monthlyFee;
        if (currentMonth.isPaid) {
          accumulator.currentMonthCollected += member.monthlyFee;
          accumulator.currentMonthPaidMembers += 1;
        }
      }

      accumulator.pendingPayments += member.overdueCount;
      accumulator.cycleExpected += applicableMonths.length * member.monthlyFee;
      accumulator.cycleCollected += paidMonths.length * member.monthlyFee;

      return accumulator;
    },
    {
      totalMembers: 0,
      activeMembers: 0,
      inactiveMembers: 0,
      pendingPayments: 0,
      currentMonthExpected: 0,
      currentMonthCollected: 0,
      currentMonthPaidMembers: 0,
      cycleExpected: 0,
      cycleCollected: 0,
    }
  );

  return {
    cycleYear,
    cycleLabel: getCycleLabel(cycleYear),
    currentMonthIndex,
    months: DISPLAY_MONTHS,
    summary,
    adminProfile: serializeAdminProfile(adminProfile),
    dueMembers,
    members: hydratedMembers,
  };
}

const getMembers = asyncHandler(async (req, res) => {
  const search = req.query.search?.trim();
  const status = req.query.status?.trim();
  const query = {};

  if (search) {
    query.name = {
      $regex: escapeRegExp(search),
      $options: "i",
    };
  }

  if (status === "active" || status === "inactive") {
    query.status = status;
  }

  const adminProfile = await ensureAdminProfile(req.user);
  const shouldLoadAllMembers = Boolean(search || status);
  const [members, allMembers] = await Promise.all([
    Member.find(query).sort({ createdAt: 1, _id: 1 }),
    shouldLoadAllMembers
      ? Member.find({}).sort({ createdAt: 1, _id: 1 })
      : Promise.resolve(null),
  ]);
  const dueMembers = await checkDueMembers({
    members: allMembers || members,
    adminProfile,
  });

  res.json(buildDashboardResponse(members, { adminProfile, dueMembers }));
});

const getDueMembers = asyncHandler(async (req, res) => {
  const adminProfile = await ensureAdminProfile(req.user);
  const dueMembers = await checkDueMembers({ adminProfile });

  res.json({
    dueMembers,
    adminProfile: serializeAdminProfile(adminProfile),
  });
});

const createMember = asyncHandler(async (req, res) => {
  let payload;

  try {
    payload = parseMemberPayload(req.body);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const member = await Member.create(payload);
  res.status(201).json({
    message: "Member created successfully.",
    member,
  });
});

const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error("Member not found.");
  }

  let payload;

  try {
    payload = parseMemberPayload(req.body, { partial: true });
  } catch (error) {
    res.status(400);
    throw error;
  }

  Object.assign(member, payload);
  await member.save();

  res.json({
    message: "Member updated successfully.",
    member,
  });
});

const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error("Member not found.");
  }

  await member.deleteOne();
  res.json({
    message: "Member deleted successfully.",
  });
});

const toggleMemberStatus = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error("Member not found.");
  }

  member.status = member.status === "active" ? "inactive" : "active";
  await member.save();

  res.json({
    message:
      member.status === "active"
        ? "Member marked as active."
        : "Member marked as inactive.",
    status: member.status,
  });
});

const togglePayment = asyncHandler(async (req, res) => {
  const cycleYear = Number(req.body.cycleYear);
  const monthIndex = Number(req.body.monthIndex);
  const member = await Member.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error("Member not found.");
  }

  if (!Number.isInteger(cycleYear) || !Number.isInteger(monthIndex)) {
    res.status(400);
    throw new Error("Cycle year and month index are required.");
  }

  const snapshot = buildMemberCycle(member, new Date(), cycleYear);
  const targetMonth = snapshot.months[monthIndex];

  if (!targetMonth || !targetMonth.isApplicable) {
    res.status(400);
    throw new Error("This month is not applicable for the selected member.");
  }

  const paymentKey = getMonthKey(cycleYear, monthIndex);
  const paymentSource = member.monthlyFees || member.feeStatus || member.payments;
  const currentValue = paymentSource?.get(paymentKey);
  const nextPaidValue = !currentValue?.paid;
  const nextValue = {
    paid: nextPaidValue,
    paidAt: nextPaidValue ? new Date() : null,
  };

  ensurePaymentMaps(member);
  member.monthlyFees.set(paymentKey, nextValue);
  member.feeStatus.set(paymentKey, nextValue);
  member.payments.set(paymentKey, nextValue);

  await member.save();

  res.json({
    message: nextPaidValue
      ? `${targetMonth.label} fee marked as paid.`
      : `${targetMonth.label} fee marked as unpaid.`,
    payment: {
      key: paymentKey,
      paid: nextPaidValue,
    },
  });
});

const sendMemberReminder = asyncHandler(async (req, res) => {
  const adminProfile = await ensureAdminProfile(req.user);
  let result;

  try {
    result = await sendReminderToMemberById(req.params.id, {
      adminProfile,
      triggeredBy: "manual",
      referenceDate: new Date(),
    });
  } catch (error) {
    res.status(502);
    throw error;
  }

  if (result.skipped) {
    res.status(result.message === "Member not found." ? 404 : 400);
    throw new Error(result.message);
  }

  // Return success response with delivery status info
  // Frontend should only show success if SMS was actually submitted successfully
  res.json({
    ...result,
    message: result.message,
    deliveryStatus: "submitted", // "submitted" = queued with provider, not delivered yet
  });
});

const sendAllMemberReminders = asyncHandler(async (req, res) => {
  const adminProfile = await ensureAdminProfile(req.user);
  const result = await sendAllDueReminders({
    adminProfile,
    triggeredBy: "manual",
    referenceDate: new Date(),
  });

  if (result.sentCount === 0 && result.failedCount > 0) {
    res.status(502);
    throw new Error(result.message);
  }

  if (result.sentCount === 0 && result.skippedCount > 0) {
    res.status(400);
    throw new Error(result.message);
  }

  res.json(result);
});

module.exports = {
  createMember,
  deleteMember,
  getDueMembers,
  getMembers,
  sendAllMemberReminders,
  sendMemberReminder,
  toggleMemberStatus,
  togglePayment,
  updateMember,
};
