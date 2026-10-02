const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { webhookRouter } = require("./routes/webhook.routes");
const testRoutes = require("./routes/test.routes");
const automationRoutes = require("./routes/automation.routes");
const leadRoutes = require("./routes/lead.routes");
const { errorMiddleware } = require("./middleware/error.middleware");
const { notFoundMiddleware } = require("./middleware/notFound.middleware");
const { logger } = require("./utils/logger");

function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // Cross-origin (configure allowed origins later as needed)
  app.use(cors());

  // Request body parsing
  app.use(express.json({ limit: "1mb" }));

  // HTTP request logs
  app.use(
    morgan("combined", {
      stream: {
        write: (msg) => logger.info(msg.trim())
      }
    })
  );

  // Root route
  app.get("/", (req, res) => {
    res.json({
      status: "running",
      project: "CareerSnap Automation",
      version: "1.0.0"
    });
  });

  // Health route
  app.get("/health", (req, res) => {
    res.json({ success: true });
  });

  // Debug route to check environment variables
  app.get("/debug/env", (req, res) => {
    const { env } = require("./config/env");
    res.json({
      hasMetaAccessToken: !!env.META_ACCESS_TOKEN,
      hasMetaAppId: !!env.META_APP_ID,
      hasMetaAppSecret: !!env.META_APP_SECRET,
      metaAccessTokenLength: env.META_ACCESS_TOKEN.length,
      metaAppId: env.META_APP_ID,
      metaIgUserId: env.META_IG_USER_ID,
      metaGraphApiVersion: env.META_GRAPH_API_VERSION
    });
  });

  // Routes
  app.use("/", webhookRouter);
  app.use("/", testRoutes);
  app.use("/", automationRoutes);
  app.use("/", leadRoutes);

  // 404 + error handlers (always last)
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };

