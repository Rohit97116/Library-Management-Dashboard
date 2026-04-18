const env = require("../config/env");

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

function buildReminderMessage({ memberName, libraryName, adminName, adminPhone }) {
  // New professional format with admin details
  return `Hello ${memberName},

Your monthly library fee is due.
Please pay as soon as possible.

From: ${adminName}
Library: ${libraryName}`;
}

function getConfiguredSmsProvider() {
  return env.smsProvider || "twilio";
}

function buildTwilioSenderPayload() {
  if (env.twilioMessagingServiceSid) {
    return {
      MessagingServiceSid: env.twilioMessagingServiceSid,
    };
  }

  if (env.twilioFromNumber) {
    return {
      From: env.twilioFromNumber,
    };
  }

  throw new Error(
    "Twilio sender is missing. Set TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID in the backend environment."
  );
}

function assertTwilioConfig() {
  const missingKeys = [];

  if (!env.twilioAccountSid) {
    missingKeys.push("TWILIO_ACCOUNT_SID");
  }

  if (!env.twilioAuthToken) {
    missingKeys.push("TWILIO_AUTH_TOKEN");
  }

  if (!env.twilioFromNumber && !env.twilioMessagingServiceSid) {
    missingKeys.push("TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID");
  }

  if (missingKeys.length > 0) {
    throw new Error(
      `Twilio SMS is not configured. Missing: ${missingKeys.join(", ")}.`
    );
  }
}

function isTrialModeError(error) {
  const errorMessage = String(error?.message || "").toLowerCase();
  return (
    errorMessage.includes("unverified") ||
    errorMessage.includes("trial") ||
    errorMessage.includes("cannot send")
  );
}

async function checkTwilioTrialMode() {
  try {
    if (!env.twilioAccountSid || !env.twilioAuthToken) {
      return null;
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env.twilioAccountSid}.json`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${env.twilioAccountSid}:${env.twilioAuthToken}`
          ).toString("base64")}`,
        },
      }
    );

    const payload = await response.json().catch(() => ({}));

    if (response.ok && payload) {
      // Twilio account type: "Trial" or "Full"
      // Trial accounts have restricted capabilities
      return {
        isTrialAccount: payload.type === "Trial",
        accountType: payload.type || "Unknown",
        status: payload.status || "active",
      };
    }
  } catch (error) {
    // Silently fail - trial mode detection is not critical
    console.error("Error checking Twilio trial mode:", error.message);
  }

  return null;
}

async function sendViaTwilio({ to, message }) {
  assertTwilioConfig();

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.twilioAccountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.twilioAccountSid}:${env.twilioAuthToken}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        Body: message,
        ...buildTwilioSenderPayload(),
      }),
    }
  );

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = payload.message || "Failed to send reminder via Twilio.";
    
    // Check if it's a trial mode unverified number error
    if (isTrialModeError(payload)) {
      const error = new Error(
        `SMS failed: recipient number is not verified (Twilio Trial limitation)`
      );
      error.code = "TRIAL_MODE_UNVERIFIED";
      error.originalMessage = errorMessage;
      throw error;
    }
    
    throw new Error(errorMessage);
  }

  // Twilio initial status is usually "queued" or "accepted"
  // In production, we should use webhooks to track delivery
  // For now, we return the status but only log as "sent" when we have confirmation
  return {
    provider: "twilio",
    simulated: false,
    externalId: payload.sid,
    status: payload.status || "queued", // queued, accepted, sending, sent, delivered, failed, undelivered
    initialStatus: payload.status || "queued",
  };
}

async function sendReminderSms({ to, message }) {
  const normalizedPhoneNumber = normalizePhoneNumber(to);
  if (!normalizedPhoneNumber) {
    throw new Error("A valid phone number is required to send reminders.");
  }

  if (getConfiguredSmsProvider() !== "twilio") {
    throw new Error(
      `Unsupported SMS provider \"${getConfiguredSmsProvider()}\". Set SMS_PROVIDER=twilio.`
    );
  }

  return sendViaTwilio({
    to: normalizedPhoneNumber,
    message,
  });
}

module.exports = {
  buildReminderMessage,
  getConfiguredSmsProvider,
  normalizePhoneNumber,
  sendReminderSms,
  checkTwilioTrialMode,
};
