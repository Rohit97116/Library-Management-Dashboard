const app = require("./app");
const env = require("./config/env");
const connectDatabase = require("./config/db");
const { ensureAdminProfile } = require("./services/adminProfileService");
const ensureAdminUser = require("./utils/ensureAdmin");
const migrateLegacyMemberData = require("./utils/migrateLegacyMemberData");

async function startServer() {
  try {
    await connectDatabase();
    const adminUser = await ensureAdminUser();
    await ensureAdminProfile(adminUser);
    await migrateLegacyMemberData();

    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to boot API", error);
    process.exit(1);
  }
}

startServer();
