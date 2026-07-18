const { processKeyword } = require("./keywordEngine");
const { generateAIResponse } = require("./ai.service");
const { getJobBySearchCode } = require("./supabase.service");
const { sendInstagramDM, sendPrivateReply } = require("./instagram.service");
const { logger } = require("../utils/logger");

/**
 * Automation Engine
 * -----------------
 * Orchestrates incoming Instagram comment automation:
 * keywords → search codes → Supabase → AI fallback → Instagram DM.
 */

/** DM text when a search code has no matching job in Supabase. */
const SEARCH_CODE_NOT_FOUND_DM =
  "Sorry, this Search Code was not found.\n\nPlease verify the code and try again.";

/**
 * Normalize an incoming message to a safe, comparable string.
 *
 * @param {unknown} message - Raw incoming message
 * @returns {string} Trimmed message text
 */
function normalizeMessage(message) {
  return String(message ?? "").trim();
}

/**
 * Build the Instagram DM text for a job found via search code lookup.
 *
 * @param {{ company?: string, title?: string, job_link?: string }} job - Job record
 * @returns {string} Formatted job DM message
 */
function buildJobFoundDmMessage({ company, title, job_link }) {
  return [
    "🎉 Job Found",
    "",
    `Company: ${company ?? ""}`,
    "",
    `Role: ${title ?? ""}`,
    "",
    "Apply Here:",
    "",
    job_link ?? "",
    "",
    "Powered by CareerSnap 🚀"
  ].join("\n");
}

/**
 * Build the Instagram DM text from a successful automation result.
 *
 * @param {{ success: boolean, source?: string, data?: object }} result - Automation result
 * @returns {string|null} DM message text, or null when no message should be sent
 */
function buildDmMessageFromResult(result) {
  if (!result?.success || !result.data) {
    return null;
  }

  if (result.source === "keyword") {
    const { type, reply } = result.data;

    switch (type) {
      case "link":
        return `Visit CareerSnap\n\n${reply}`;
      case "job":
      case "pdf":
      case "help":
        return reply || null;
      default:
        return reply || null;
    }
  }

  if (result.source === "database") {
    const { title, company, job_link } = result.data;
    return buildJobFoundDmMessage({ company, title, job_link });
  }

  if (result.source === "ai") {
    return result.data.reply || null;
  }

  return null;
}

/**
 * Send a pre-built Instagram DM and log the outcome.
 *
 * According to Meta's official documentation for Private Replies:
 * https://developers.facebook.com/docs/instagram-platform/private-replies/
 *
 * When replying to a comment for the first time, use comment_id instead of user ID.
 * This bypasses the 24-hour messaging window restriction.
 *
 * @param {string} recipientId - Instagram-scoped user ID (IGSID)
 * @param {string} dmMessage - Message text to send
 * @param {{ source?: string, status?: string, searchCode?: string, commentId?: string }} logContext - Logging context
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function sendAutomationDm(recipientId, dmMessage, logContext = {}) {
  if (!recipientId || !dmMessage) {
    return { success: false, error: "Missing recipientId or message" };
  }

  logger.info("DM request", {
    recipientId,
    commentId: logContext.commentId,
    ...logContext
  });

  // Use Private Reply API when commentId is available (first reply after comment)
  // This bypasses the "Outside Allowed Window" error
  let dmResult;
  if (logContext.commentId) {
    logger.info("Using Private Reply API (comment_id)", {
      commentId: logContext.commentId,
      recipientId
    });
    dmResult = await sendPrivateReply(logContext.commentId, dmMessage);
  } else {
    logger.info("Using standard DM API (user_id)", {
      recipientId
    });
    dmResult = await sendInstagramDM(recipientId, dmMessage);
  }

  if (dmResult.success) {
    logger.info("DM sent successfully", {
      recipientId,
      commentId: logContext.commentId,
      ...logContext
    });
  } else {
    logger.error("DM send failed", {
      recipientId,
      commentId: logContext.commentId,
      error: dmResult.error,
      ...logContext
    });
  }

  return dmResult;
}

/**
 * Send an Instagram DM for a successful keyword, database, or AI automation result.
 *
 * @param {string} recipientId - Instagram-scoped user ID (IGSID)
 * @param {{ success: boolean, source?: string, data?: object }} result - Automation result
 * @param {{ commentId?: string }} context - Additional context including commentId
 * @returns {Promise<void>}
 */
async function dispatchResultDm(recipientId, result, context = {}) {
  if (!recipientId || !result?.success) {
    return;
  }

  const allowedSources = ["keyword", "database", "ai"];
  if (!allowedSources.includes(result.source)) {
    return;
  }

  const dmMessage = buildDmMessageFromResult(result);
  if (!dmMessage) {
    return;
  }

  await sendAutomationDm(recipientId, dmMessage, {
    source: result.source,
    commentId: context.commentId
  });
}

/**
 * Send the not-found DM when a search code has no matching job in Supabase.
 *
 * @param {string} recipientId - Instagram-scoped user ID (IGSID)
 * @param {string} searchCode - Search code that was not found
 * @param {{ commentId?: string }} context - Additional context including commentId
 * @returns {Promise<void>}
 */
async function dispatchSearchCodeNotFoundDm(recipientId, searchCode, context = {}) {
  await sendAutomationDm(recipientId, SEARCH_CODE_NOT_FOUND_DM, {
    source: "search_code",
    status: "not_found",
    searchCode,
    commentId: context.commentId
  });
}

/**
 * Process an incoming message and return a consistent response envelope.
 * Optionally sends Instagram DMs when a recipient ID is provided.
 *
 * @param {unknown} message - Incoming comment text
 * @param {string|null} [recipientId] - Instagram user ID for DM delivery
 * @param {{ username?: string, commentId?: string, mediaId?: string }} [context] - Webhook context for logging
 * @returns {Promise<object>} Structured automation response
 */
async function processIncomingMessage(message, recipientId = null, context = {}) {
  try {
    const normalizedMessage = normalizeMessage(message);
    const result = processKeyword(normalizedMessage);

    // Keyword fast path
    if (result.source === "keyword" && result.success) {
      logger.info("Keyword detected", {
        username: context.username,
        userId: recipientId,
        commentId: context.commentId,
        mediaId: context.mediaId,
        commentText: normalizedMessage,
        keyword: result.data?.type
      });

      await dispatchResultDm(recipientId, result, { commentId: context.commentId });
      return result;
    }

    // Search code path
    if (result.type === "search_code" && result.code) {
      const searchCode = result.code;

      logger.info("Search code detected", {
        username: context.username,
        userId: recipientId,
        commentId: context.commentId,
        mediaId: context.mediaId,
        commentText: normalizedMessage,
        searchCode
      });

      const job = await getJobBySearchCode(searchCode);
      const isFound = Boolean(job.title || job.company || job.job_link);

      logger.info("Supabase lookup result", {
        searchCode,
        found: isFound,
        title: isFound ? job.title : "",
        company: isFound ? job.company : ""
      });

      if (!isFound) {
        await dispatchSearchCodeNotFoundDm(recipientId, searchCode, { commentId: context.commentId });
        return {
          success: false,
          message: "Search Code not found"
        };
      }

      const databaseResult = {
        success: true,
        source: "database",
        data: {
          search_code: searchCode,
          title: job.title,
          company: job.company,
          job_link: job.job_link
        }
      };

      await dispatchResultDm(recipientId, databaseResult, { commentId: context.commentId });
      return databaseResult;
    }

    // AI fallback for unknown comments
    logger.info("AI fallback triggered", {
      username: context.username,
      userId: recipientId,
      commentId: context.commentId,
      mediaId: context.mediaId,
      commentText: normalizedMessage
    });

    const aiResult = await generateAIResponse(normalizedMessage);

    if (!aiResult?.success || !aiResult.reply) {
      logger.error("AI service unavailable", {
        username: context.username,
        userId: recipientId,
        commentText: normalizedMessage
      });

      return {
        success: false,
        message: "AI Service Unavailable"
      };
    }

    logger.info("AI response generated", {
      username: context.username,
      userId: recipientId,
      provider: aiResult.provider,
      replyPreview: aiResult.reply.slice(0, 120)
    });

    const aiResponse = {
      success: true,
      source: "ai",
      data: {
        reply: aiResult.reply
      }
    };

    await dispatchResultDm(recipientId, aiResponse, { commentId: context.commentId });
    return aiResponse;
  } catch (err) {
    logger.error("Automation engine error", {
      userId: recipientId,
      username: context.username,
      message: err instanceof Error ? err.message : String(err)
    });

    return {
      success: false,
      message: "Automation Engine Error"
    };
  }
}

module.exports = {
  processIncomingMessage,
  buildDmMessageFromResult,
  buildJobFoundDmMessage,
  dispatchResultDm,
  dispatchSearchCodeNotFoundDm,
  sendAutomationDm
};
