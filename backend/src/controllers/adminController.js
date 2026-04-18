const asyncHandler = require("../utils/asyncHandler");
const { ensureAdminProfile, serializeAdminProfile } = require("../services/adminProfileService");

function parseProfilePayload(body) {
  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const libraryName = body.libraryName?.trim();

  if (!name) {
    throw new Error("Admin name is required.");
  }

  if (!phone) {
    throw new Error("Admin phone number is required.");
  }

  if (!libraryName) {
    throw new Error("Library name is required.");
  }

  return {
    name,
    phone,
    libraryName,
  };
}

const getAdminProfile = asyncHandler(async (req, res) => {
  const profile = await ensureAdminProfile(req.user);
  res.json({
    profile: serializeAdminProfile(profile),
  });
});

const updateAdminProfile = asyncHandler(async (req, res) => {
  let payload;

  try {
    payload = parseProfilePayload(req.body);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const profile = await ensureAdminProfile(req.user);
  profile.name = payload.name;
  profile.phone = payload.phone;
  profile.libraryName = payload.libraryName;
  await profile.save();

  if (req.user.name !== payload.name) {
    req.user.name = payload.name;
    await req.user.save();
  }

  res.json({
    message: "Admin profile updated successfully.",
    profile: serializeAdminProfile(profile),
    user: {
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
    },
  });
});

module.exports = {
  getAdminProfile,
  updateAdminProfile,
};
