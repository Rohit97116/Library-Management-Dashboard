const env = require("../config/env");
const AdminProfile = require("../models/AdminProfile");

function serializeAdminProfile(profile) {
  if (!profile) {
    return null;
  }

  return {
    id: profile._id,
    name: profile.name,
    phone: profile.phone,
    libraryName: profile.libraryName,
    updatedAt: profile.updatedAt,
  };
}

async function ensureAdminProfile(user) {
  if (!user) {
    return null;
  }

  let profile = await AdminProfile.findOne({ user: user._id });

  if (!profile) {
    profile = await AdminProfile.create({
      user: user._id,
      name: user.name || env.adminName,
      phone: env.adminPhone,
      libraryName: env.libraryName,
    });

    return profile;
  }

  let shouldSave = false;

  if (!profile.name?.trim()) {
    profile.name = user.name || env.adminName;
    shouldSave = true;
  }

  if (!profile.libraryName?.trim()) {
    profile.libraryName = env.libraryName;
    shouldSave = true;
  }

  if (!profile.phone?.trim() && env.adminPhone) {
    profile.phone = env.adminPhone;
    shouldSave = true;
  }

  if (shouldSave) {
    await profile.save();
  }

  return profile;
}

async function getPrimaryAdminProfile() {
  return AdminProfile.findOne().sort({ createdAt: 1 });
}

module.exports = {
  ensureAdminProfile,
  getPrimaryAdminProfile,
  serializeAdminProfile,
};
