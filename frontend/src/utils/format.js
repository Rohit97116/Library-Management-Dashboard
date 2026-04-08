const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
});

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatDate(value) {
  if (!value) {
    return "--";
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime())
    ? "--"
    : dateFormatter.format(parsedDate);
}

export function formatShortDate(value) {
  if (!value) {
    return "--";
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime())
    ? "--"
    : shortDateFormatter.format(parsedDate);
}

export function formatCurrency(value) {
  const numericValue = Number(value);
  return currencyFormatter.format(Number.isFinite(numericValue) ? numericValue : 0);
}

export function formatMonthCaption(month) {
  if (!month?.isApplicable) {
    return "N/A";
  }

  if (month.isPaid) {
    return month.paidAt ? `Paid ${formatShortDate(month.paidAt)}` : "Paid";
  }

  return month.dueDate ? `Due ${formatShortDate(month.dueDate)}` : "Open";
}
