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

function buildReminderMessage({ memberName, libraryName }) {
  return `Hello ${memberName}, your monthly library fee is due. Please pay as soon as possible. - ${libraryName}`;
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
    throw new Error(payload.message || "Failed to send reminder via Twilio.");
  }

  return {
    provider: "twilio",
    simulated: false,
    externalId: payload.sid,
    status: payload.status || "queued",
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
};
