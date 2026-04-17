const DISPLAY_MONTHS = [
  { index: 0, label: "Mar" },
  { index: 1, label: "Apr" },
  { index: 2, label: "May" },
  { index: 3, label: "Jun" },
  { index: 4, label: "Jul" },
  { index: 5, label: "Aug" },
  { index: 6, label: "Sep" },
  { index: 7, label: "Oct" },
  { index: 8, label: "Nov" },
  { index: 9, label: "Dec" },
  { index: 10, label: "Jan" },
  { index: 11, label: "Feb" },
];

function getFiscalCycleYear(referenceDate = new Date()) {
  return referenceDate.getMonth() >= 2
    ? referenceDate.getFullYear()
    : referenceDate.getFullYear() - 1;
}

function getCycleLabel(cycleYear) {
  return `${cycleYear}-${String((cycleYear + 1) % 100).padStart(2, "0")}`;
}

function getCycleMonthIndex(referenceDate = new Date()) {
  const month = referenceDate.getMonth();
  return month >= 2 ? month - 2 : month + 10;
}

function getCalendarYearForCycleMonth(cycleYear, monthIndex) {
  return monthIndex <= 9 ? cycleYear : cycleYear + 1;
}

function getCalendarMonthForCycleMonth(monthIndex) {
  return monthIndex <= 9 ? monthIndex + 2 : monthIndex - 10;
}

function getMonthKey(cycleYear, monthIndex) {
  return `${cycleYear}-${monthIndex}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function stripTime(dateInput) {
  const date = new Date(dateInput);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isMonthApplicable(joinDate, cycleYear, monthIndex) {
  const year = getCalendarYearForCycleMonth(cycleYear, monthIndex);
  const month = getCalendarMonthForCycleMonth(monthIndex);
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return monthEnd >= stripTime(joinDate);
}

function getDueDateForMonth(joinDateInput, cycleYear, monthIndex) {
  const joinDate = new Date(joinDateInput);
  const year = getCalendarYearForCycleMonth(cycleYear, monthIndex);
  const month = getCalendarMonthForCycleMonth(monthIndex);
  const dueDay = Math.min(joinDate.getDate(), getDaysInMonth(year, month));

  return new Date(year, month, dueDay, 23, 59, 59, 999);
}

function normalizePayments(member) {
  const source = member?.monthlyFees || member?.feeStatus || member?.payments;
  if (!source) {
    return {};
  }

  if (source instanceof Map) {
    return Object.fromEntries(source.entries());
  }

  if (typeof source.toObject === "function") {
    return source.toObject();
  }

  return source;
}

function buildMemberCycle(member, referenceDate = new Date(), cycleYear) {
  const activeCycleYear =
    typeof cycleYear === "number" ? cycleYear : getFiscalCycleYear(referenceDate);
  const joinDate = new Date(member.dateOfJoining);
  const paymentMap = normalizePayments(member);

  const months = DISPLAY_MONTHS.map(({ index, label }) => {
    const calendarYear = getCalendarYearForCycleMonth(activeCycleYear, index);
    const calendarMonth = getCalendarMonthForCycleMonth(index);
    const key = getMonthKey(activeCycleYear, index);
    const paymentState = paymentMap[key] || { paid: false, paidAt: null };
    const isApplicable = isMonthApplicable(joinDate, activeCycleYear, index);

    if (!isApplicable) {
      return {
        key,
        index,
        label,
        calendarYear,
        calendarMonth: calendarMonth + 1,
        isApplicable: false,
        isPaid: false,
        isOverdue: false,
        isUpcoming: false,
        dueDate: null,
        paidAt: null,
        tone: "na",
      };
    }

    const dueDate = getDueDateForMonth(joinDate, activeCycleYear, index);
    const isPaid = Boolean(paymentState.paid);
    const isOverdue = !isPaid && referenceDate > dueDate;
    const isUpcoming = !isPaid && referenceDate <= dueDate;

    return {
      key,
      index,
      label,
      calendarYear,
      calendarMonth: calendarMonth + 1,
      isApplicable: true,
      isPaid,
      isOverdue,
      isUpcoming,
      dueDate: dueDate.toISOString(),
      paidAt: paymentState.paidAt ? new Date(paymentState.paidAt).toISOString() : null,
      tone: isPaid ? "paid" : isOverdue ? "overdue" : "upcoming",
    };
  });

  return {
    cycleYear: activeCycleYear,
    cycleLabel: getCycleLabel(activeCycleYear),
    months,
    currentMonthIndex: getCycleMonthIndex(referenceDate),
  };
}

module.exports = {
  DISPLAY_MONTHS,
  buildMemberCycle,
  getCalendarMonthForCycleMonth,
  getCalendarYearForCycleMonth,
  getCycleLabel,
  getCycleMonthIndex,
  getDueDateForMonth,
  getFiscalCycleYear,
  getMonthKey,
  isMonthApplicable,
};
