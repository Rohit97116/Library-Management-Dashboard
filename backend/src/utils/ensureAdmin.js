const bcrypt = require("bcryptjs");
const env = require("../config/env");
const User = require("../models/User");

async function ensureAdminUser() {
  const username = env.adminUsername.trim().toLowerCase();
  const existingUser = await User.findOne({ username }).select("+passwordHash");
  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  let activeUser = existingUser;

  if (existingUser) {
    let shouldSave = false;

    if (existingUser.name !== env.adminName) {
      existingUser.name = env.adminName;
      shouldSave = true;
    }

    // Keep the configured admin credentials in sync so changing .env is enough.
    existingUser.passwordHash = passwordHash;
    shouldSave = true;

    if (shouldSave) {
      await existingUser.save();
    }
  } else {
    activeUser = await User.create({
      name: env.adminName,
      username,
      passwordHash,
    });

    console.log(`Seeded admin user "${username}"`);
  }

  await User.deleteMany({ username: { $ne: username } });
  return activeUser;
}

module.exports = ensureAdminUser;
