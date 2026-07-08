const { env } = require("../config/env");
const { logger } = require("../utils/logger");
const { processIncomingMessage } = require("../services/automationEngine");

/**
 * Meta webhook verification:
 * Meta sends hub.* query params which must be validated with VERIFY_TOKEN.
 *
 * @param {import("express").Request} req - Express request
 * @param {import("express").Response} res - Express response
 * @returns {import("express").Response} HTTP response
 */
function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const isSubscribe = mode === "subscribe";
  const isValid = isSubscribe && token && token === env.VERIFY_TOKEN;

  if (isValid) {
    logger.info("Webhook verified successfully");
    return res.status(200).send(String(challenge));
  }

  logger.warn("Webhook verification failed", { mode, tokenProvided: Boolean(token) });
  return res.sendStatus(403);
}

/**
 * Safely extract Instagram comment fields from a Meta webhook payload.
 *
 * @param {object|null|undefined} body - Raw webhook request body
 * @returns {{
 *   commentText: string,
 *   commentId: string,
 *   username: string,
 *   userId: string,
 *   mediaId: string,
 *   hasComment: boolean
 * }}
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

  const entries = Array.isArray(body.entry) ? body.entry : [];

  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes) ? entry.changes : [];

    for (const change of changes) {
      if (change?.field !== "comments") continue;

      const value = change?.value && typeof change.value === "object" ? change.value : {};
      const from = value.from && typeof value.from === "object" ? value.from : {};
      const media = value.media && typeof value.media === "object" ? value.media : {};

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
 * Webhook receiver:
 * Extracts Instagram comment data, runs Automation Engine, always returns HTTP 200 to Meta.
 *
 * @param {import("express").Request} req - Express request
 * @param {import("express").Response} res - Express response
 * @returns {Promise<import("express").Response>} HTTP 200 response
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

    if (comment.hasComment) {
      logger.info("Comment payload extracted", {
        username: comment.username,
        userId: comment.userId,
        commentId: comment.commentId,
        mediaId: comment.mediaId,
        commentText: comment.commentText
      });
    } else {
      logger.warn("Unknown webhook payload", {
        object: req.body?.object ?? "unknown"
      });
    }

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
      message: err instanceof Error ? err.message : String(err)
    });

    // Meta requires HTTP 200 even when internal processing fails
    return res.status(200).json({
      success: false,
      message: "Webhook processed with errors"
    });
  }
}

module.exports = { verifyWebhook, receiveWebhook, extractCommentFromPayload };
