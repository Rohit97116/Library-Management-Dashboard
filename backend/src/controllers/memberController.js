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

  if (!partial || body.dateOfJoining !== undefined) {
    const joiningDate = new Date(body.dateOfJoining);
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
    const status = body.status === "inactive" ? "inactive" : "active";
    payload.status = status;
  }

  if (!partial || body.phone !== undefined) {
    payload.phone = body.phone?.trim() || "";
  }

  return payload;
}

function sortMembers(left, right) {
  if (left.status !== right.status) {
    return left.status === "active" ? -1 : 1;
  }

  return left.name.localeCompare(right.name);
}

function buildDashboardResponse(members, referenceDate = new Date()) {
  const cycleYear = getFiscalCycleYear(referenceDate);
  const currentMonthIndex = getCycleMonthIndex(referenceDate);

  const hydratedMembers = members
    .map((member) => {
      const snapshot = buildMemberCycle(member, referenceDate, cycleYear);
      const overdueCount = snapshot.months.filter((month) => month.isOverdue).length;
      const paidCount = snapshot.months.filter((month) => month.isPaid).length;

      return {
        id: member._id,
        name: member.name,
        phone: member.phone,
        monthlyFee: member.monthlyFee,
        status: member.status,
        dateOfJoining: member.dateOfJoining,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        overdueCount,
        paidCount,
        months: snapshot.months,
      };
    })
    .sort(sortMembers);

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

  const members = await Member.find(query).sort({ createdAt: -1 });
  res.json(buildDashboardResponse(members));
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
  const currentValue = member.payments.get(paymentKey);
  const nextPaidValue = !currentValue?.paid;

  member.payments.set(paymentKey, {
    paid: nextPaidValue,
    paidAt: nextPaidValue ? new Date() : null,
  });

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

module.exports = {
  createMember,
  deleteMember,
  getMembers,
  toggleMemberStatus,
  togglePayment,
  updateMember,
};
