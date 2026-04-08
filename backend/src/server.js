const app = require("./app");
const env = require("./config/env");
const connectDatabase = require("./config/db");
const ensureAdminUser = require("./utils/ensureAdmin");

async function startServer() {
  try {
    await connectDatabase();
    await ensureAdminUser();

    app.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to boot API", error);
    process.exit(1);
  }
}

startServer();
