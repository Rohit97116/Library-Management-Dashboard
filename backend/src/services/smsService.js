function normalizePhoneNumber(value) {
  const rawValue = String(value || "").replace(/[^\d+]/g, "").trim();

  if (!rawValue) {
    return "";
  }

  if (rawValue.startsWith("+")) {
    return rawValue;
  }

  if (rawValue.length === 10) {
    return `+91${rawValue}`;
  }

  return rawValue;
}

function buildReminderMessage({ memberName, libraryName }) {
  return `Hello ${memberName}, your monthly library fee is due. Please pay as soon as possible. - ${libraryName}`;
}

async function sendReminderSms({ to, message }) {
  const normalizedPhoneNumber = normalizePhoneNumber(to);
  if (!normalizedPhoneNumber) {
    throw new Error("A valid phone number is required to send reminders.");
  }

  console.log(`[manual-reminder] Simulated reminder to ${normalizedPhoneNumber}: ${message}`);

  return {
    provider: "simulation",
    simulated: true,
    externalId: `sim-${Date.now()}`,
  };
}

module.exports = {
  buildReminderMessage,
  normalizePhoneNumber,
  sendReminderSms,
};
