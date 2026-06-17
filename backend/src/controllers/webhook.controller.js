const { env } = require("../config/env");
const { logger } = require("../utils/logger");

/**
 * Meta webhook verification:
 * Meta sends hub.* query params which must be validated with VERIFY_TOKEN.
 */
function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const isSubscribe = mode === "subscribe";
  const isValid = isSubscribe && token && token === env.VERIFY_TOKEN;

  if (isValid) {
    logger.info("Webhook verified successfully");
    // Meta expects the raw challenge string/number
    return res.status(200).send(String(challenge));
  }

  logger.warn("Webhook verification failed", { mode, tokenProvided: Boolean(token) });
  return res.sendStatus(403);
}

/**
 * Webhook receiver:
 * Logs payload and responds success.
 */
function receiveWebhook(req, res) {
  logger.info("Webhook payload received", req.body);

  return res.status(200).json({
    success: true,
    message: "Webhook received"
  });
}

module.exports = { verifyWebhook, receiveWebhook };

