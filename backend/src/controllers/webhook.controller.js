const { env } = require("../config/env");
const { logger } = require("../utils/logger");
const { processIncomingMessage } = require("../services/automationEngine");

/**
 * Meta webhook verification
 */
function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const isSubscribe = mode === "subscribe";
  const isValid =
    isSubscribe &&
    token &&
    token === env.VERIFY_TOKEN;

  if (isValid) {
    logger.info("Webhook verified successfully");
    return res.status(200).send(String(challenge));
  }

  logger.warn("Webhook verification failed", {
    mode,
    tokenProvided: Boolean(token)
  });

  return res.sendStatus(403);
}

/**
 * Extract Instagram comment fields from Meta webhook payload.
 */
function extractCommentFromPayload(body) {
  const empty = {
    commentText: "",
    commentId: "",
    username: "",
    userId: "",
    mediaId: "",
    hasComment: false
  };

  if (!body || typeof body !== "object") {
    return empty;
  }

  const entries = Array.isArray(body.entry)
    ? body.entry
    : [];

  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes)
      ? entry.changes
      : [];

    for (const change of changes) {
      if (change?.field !== "comments") {
        continue;
      }

      const value =
        change?.value && typeof change.value === "object"
          ? change.value
          : {};

      const from =
        value.from && typeof value.from === "object"
          ? value.from
          : {};

      const media =
        value.media && typeof value.media === "object"
          ? value.media
          : {};

      return {
        commentText: value.text ?? "",
        commentId: value.id ?? "",
        username: from.username ?? "",
        userId: from.id ?? "",
        mediaId: media.id ?? "",
        hasComment: true
      };
    }
  }

  return empty;
}

/**
 * Receive Meta Instagram webhook events.
 */
async function receiveWebhook(req, res) {
  try {
    logger.info("========== RAW WEBHOOK ==========");
    logger.info(JSON.stringify(req.body, null, 2));
    logger.info("=================================");

    logger.info("Webhook received", {
      object: req.body?.object ?? "unknown"
    });

    const comment = extractCommentFromPayload(req.body);

    // Only Instagram comment events should enter the automation engine.
    // Ignore message echoes, read receipts, delivery events, etc.
    if (!comment.hasComment) {
      logger.info("Ignoring non-comment webhook event", {
        object: req.body?.object ?? "unknown"
      });

      return res.status(200).json({
        success: true,
        ignored: true
      });
    }

    logger.info("Comment payload extracted", {
      username: comment.username,
      userId: comment.userId,
      commentId: comment.commentId,
      mediaId: comment.mediaId,
      commentText: comment.commentText
    });

    const automationResult = await processIncomingMessage(
      comment.commentText,
      comment.userId,
      {
        username: comment.username,
        commentId: comment.commentId,
        mediaId: comment.mediaId
      }
    );

    return res.status(200).json(automationResult);
  } catch (err) {
    logger.error("Webhook processing error", {
      message: err instanceof Error
        ? err.message
        : String(err)
    });

    // Return 200 so Meta does not keep retrying because of an internal error
    return res.status(200).json({
      success: false,
      message: "Webhook processed with errors"
    });
  }
}

module.exports = {
  verifyWebhook,
  receiveWebhook,
  extractCommentFromPayload
};