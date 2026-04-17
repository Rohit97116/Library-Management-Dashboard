const fs = require("fs");
const path = require("path");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const env = require("./config/env");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
const hasFrontendBuild = fs.existsSync(frontendDistPath);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "Ambey Library Dashboard API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/members", memberRoutes);

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
