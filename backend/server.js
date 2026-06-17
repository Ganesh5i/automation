const { createApp } = require("./src/app");
const { env } = require("./src/config/env");
const { logger } = require("./src/utils/logger");

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Server listening on port ${env.PORT}`);
});

// Graceful shutdown hooks (future-ready for queues/websockets/workers)
function shutdown(signal) {
  logger.warn(`${signal} received. Shutting down...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

