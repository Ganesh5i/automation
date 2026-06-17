const { logger } = require("../utils/logger");

/**
 * Centralized error handler.
 * Any `next(err)` lands here.
 */
function errorMiddleware(err, req, res, next) {
  logger.error("Unhandled error", {
    path: req.path,
    method: req.method,
    message: err && err.message ? err.message : String(err)
  });

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
}

module.exports = { errorMiddleware };

