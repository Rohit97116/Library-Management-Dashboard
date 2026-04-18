/**
 * WhatsApp Reminder Utilities
 * Generates properly formatted WhatsApp messages and deep links
 */

/**
 * Normalize phone number to WhatsApp format (with country code)
 * Supports: 10-digit Indian numbers, +91 prefix, or already formatted
 * Example: 9711674771 → 919711674771
 */
export function normalizePhoneForWhatsApp(phoneNumber) {
  if (!phoneNumber) return "";

  // Remove all non-digit characters except +
  let normalized = String(phoneNumber).replace(/[^\d+]/g, "");

  // If it starts with +, keep it as is
  if (normalized.startsWith("+")) {
    return normalized.replace(/\D/g, ""); // Remove + for wa.me format
  }

  // If it's 10 digits, add 91 (India country code)
  if (normalized.length === 10) {
    return `91${normalized}`;
  }

  // If it's already 12 digits (91 + 10), return as is
  if (normalized.length === 12 && normalized.startsWith("91")) {
    return normalized;
  }

  // Otherwise, assume it already has country code
  return normalized;
}

/**
 * Format currency in Indian Rupees
 */
export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDateForMessage(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format phone number with spacing (XXXXX XXXXX)
 * Converts 10-digit number to readable format: 84489 27114
 */
export function formatPhoneWithSpacing(phoneNumber) {
  if (!phoneNumber) return "";
  const digits = String(phoneNumber).replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phoneNumber;
}

/**
 * Build WhatsApp reminder message
 * Supports both single month and multiple months
 * 
 * Single month format:
 * buildWhatsAppMessage({ memberName, monthlyFee, dueDate, ... })
 * 
 * Multiple months format:
 * buildWhatsAppMessage({ memberName, overdueMonths: [{label, dueDate, amount}, ...], totalAmount, ... })
 */
export function buildWhatsAppMessage({
  memberName,
  adminName,
  libraryName,
  adminPhone,
  // Single month (backward compatible)
  monthlyFee,
  dueDate,
  // Multiple months
  overdueMonths,
  totalAmount,
}) {
  const formattedPhone = formatPhoneWithSpacing(adminPhone);

  // Handle multiple months
  if (overdueMonths && Array.isArray(overdueMonths) && overdueMonths.length > 1) {
    const formattedTotal = formatINR(totalAmount);
    const duesList = overdueMonths
      .map((month) => {
        const formattedAmount = formatINR(month.amount);
        const formattedMonthDate = formatDateForMessage(month.dueDate);
        return `• ${month.label} — ${formattedAmount}`;
      })
      .join("\n");

    return `Hello ${memberName},

Your monthly library fee is pending for multiple months.

Pending Dues:

${duesList}

Total Pending Amount: ${formattedTotal}

Please pay as soon as possible.

From:
${adminName}
${libraryName}
Contact: ${formattedPhone}

Thank you.`;
  }

  // Handle single month (including when overdueMonths has 1 item)
  if (overdueMonths && Array.isArray(overdueMonths) && overdueMonths.length === 1) {
    const month = overdueMonths[0];
    const formattedFee = formatINR(month.amount);
    const formattedDate = formatDateForMessage(month.dueDate);

    return `Hello ${memberName},

Your monthly library fee is due.
Please pay as soon as possible.

Amount Due: ${formattedFee}
Due Date: ${formattedDate}

From:
${adminName}
${libraryName}
Contact: ${formattedPhone}

Thank you.`;
  }

  // Fallback for original single month format (for backward compatibility)
  if (monthlyFee && dueDate) {
    const formattedFee = formatINR(monthlyFee);
    const formattedDate = formatDateForMessage(dueDate);

    return `Hello ${memberName},

Your monthly library fee is due.
Please pay as soon as possible.

Amount Due: ${formattedFee}
Due Date: ${formattedDate}

From:
${adminName}
${libraryName}
Contact: ${formattedPhone}

Thank you.`;
  }

  throw new Error("Must provide either overdueMonths array or monthlyFee/dueDate");
}

/**
 * Generate WhatsApp deep link with message
 * Returns the wa.me URL
 * Supports both single month and multiple months
 */
export function generateWhatsAppLink({
  phoneNumber,
  memberName,
  adminName,
  libraryName,
  adminPhone,
  // Single month (backward compatible)
  monthlyFee,
  dueDate,
  // Multiple months
  overdueMonths,
  totalAmount,
}) {
  const normalizedPhone = normalizePhoneForWhatsApp(phoneNumber);

  if (!normalizedPhone) {
    throw new Error("Valid phone number is required to send WhatsApp reminder.");
  }

  const message = buildWhatsAppMessage({
    memberName,
    monthlyFee,
    dueDate,
    adminName,
    libraryName,
    adminPhone,
    overdueMonths,
    totalAmount,
  });

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // Return WhatsApp link
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp with prefilled message
 * This opens the WhatsApp link in a new window/tab
 * Supports both single month and multiple months
 */
export function openWhatsAppReminder({
  phoneNumber,
  memberName,
  adminName,
  libraryName,
  adminPhone,
  // Single month (backward compatible)
  monthlyFee,
  dueDate,
  // Multiple months
  overdueMonths,
  totalAmount,
}) {
  try {
    const link = generateWhatsAppLink({
      phoneNumber,
      memberName,
      monthlyFee,
      dueDate,
      adminName,
      libraryName,
      adminPhone,
      overdueMonths,
      totalAmount,
    });

    // Open in new tab/window
    window.open(link, "_blank", "noopener,noreferrer");

    return {
      success: true,
      message: `WhatsApp reminder opened for ${memberName}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Generate bulk WhatsApp reminders for multiple members
 * Returns array of member data with WhatsApp links
 */
export function generateBulkWhatsAppReminders({
  members,
  adminName,
  libraryName,
  adminPhone,
}) {
  return members.map((member) => ({
    memberId: member.memberId,
    memberName: member.name,
    phoneNumber: member.phoneNumber,
    monthlyFee: member.monthlyFee,
    dueDate: member.dueDate,
    overdueCount: member.overdueCount,
    overdueAmount: member.overdueAmount,
    whatsappLink: generateWhatsAppLink({
      phoneNumber: member.phoneNumber,
      memberName: member.name,
      monthlyFee: member.monthlyFee,
      dueDate: member.dueDate,
      adminName,
      libraryName,
      adminPhone,
    }),
  }));
}
