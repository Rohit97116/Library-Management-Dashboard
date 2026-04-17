const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/ambey-library-dashboard",
  jwtSecret: process.env.JWT_SECRET || "replace-this-secret-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrls: (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  adminName: process.env.ADMIN_NAME || "Shashank Rohilla",
  adminUsername: process.env.ADMIN_USERNAME || "Shashank",
  adminPassword: process.env.ADMIN_PASSWORD || "Shanky03@26Ro",
  adminPhone: process.env.ADMIN_PHONE || "",
  libraryName: process.env.LIBRARY_NAME || "Ambey Library",
  smsProvider: (process.env.SMS_PROVIDER || "twilio").trim().toLowerCase(),
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioFromNumber: process.env.TWILIO_FROM_NUMBER || "",
  twilioMessagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID || "",
};
