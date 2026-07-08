const axios = require("axios");
const { env } = require("../config/env");
const { logger } = require("../utils/logger");

/**
 * Instagram DM Service
 * --------------------
 * Sends Instagram direct messages via the Meta Graph API.
 *
 * Tokens are never hardcoded — all credentials come from environment variables.
 * API version is read from configuration (META_GRAPH_API_VERSION).
 */

/**
 * Read Meta Graph API version from environment configuration.
 * Defaults to v21.0 when not set.
 *
 * @returns {string} Graph API version string (e.g. "v21.0")
 */
function getGraphApiVersion() {
  return process.env.META_GRAPH_API_VERSION || "v21.0";
}

/**
 * Build the base URL for Meta Graph API requests.
 *
 * @returns {string} Base URL (e.g. "https://graph.facebook.com/v21.0")
 */
function getGraphApiBaseUrl() {
  return `https://graph.instagram.com/${getGraphApiVersion()}`;
}

/**
 * Read the Meta access token from centralized environment config.
 *
 * @returns {string} Access token or empty string when not configured
 */
function getAccessToken() {
  return env.META_ACCESS_TOKEN || "";
}

/**
 * Read the Instagram professional account ID used as the messages endpoint owner.
 * Falls back to "me" when the token is scoped to the connected IG account.
 *
 * @returns {string} Instagram account ID or "me"
 */
function getInstagramAccountId() {
  return process.env.META_IG_USER_ID || "me";
}

/**
 * Build the Graph API messages endpoint for sending Instagram DMs.
 *
 * @returns {string} Full messages endpoint URL
 */
function buildMessagesEndpoint() {
  const accountId = getInstagramAccountId();
  return `${getGraphApiBaseUrl()}/${accountId}/messages`;
}

/**
 * Build the request body for an Instagram DM.
 *
 * @param {string} recipientId - Instagram-scoped user ID (IGSID) of the recipient
 * @param {string} message - Plain-text message to send
 * @returns {{ recipient: { id: string }, message: { text: string } }}
 */
function buildDmPayload(recipientId, message) {
  return {
    recipient: {
      id: String(recipientId)
    },
    message: {
      text: String(message)
    }
  };
}

/**
 * Extract a readable error message from an axios / Graph API error.
 *
 * @param {unknown} error - Caught error object
 * @returns {string} Human-readable error message
 */
function extractGraphApiError(error) {
  if (axios.isAxiosError(error)) {
    const graphError = error.response?.data?.error;
    if (graphError?.message) {
      return graphError.message;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

/**
 * Send an Instagram direct message to a user via Meta Graph API.
 *
 * @param {string} recipientId - Instagram-scoped user ID of the recipient
 * @param {string} message - Text message to send
 * @returns {Promise<{ success: true } | { success: false, error: string }>}
 */
async function sendInstagramDM(recipientId, message) {
  const accessToken = getAccessToken();

  if (!accessToken) {
    const error = "META_ACCESS_TOKEN is not configured";
    logger.error("Instagram DM send failed", { recipientId, error });
    return { success: false, error };
  }

  if (!recipientId || !message) {
    const error = "recipientId and message are required";
    logger.error("Instagram DM send failed", { recipientId, error });
    return { success: false, error };
  }

  try {
    const url = buildMessagesEndpoint();
    const payload = buildDmPayload(recipientId, message);

    await axios.post(url, payload, {
      params: {
        access_token: accessToken
      }
    });

    logger.info("Instagram DM sent successfully", {
      recipientId,
      apiVersion: getGraphApiVersion()
    });

    return { success: true };
  } catch (error) {
    const errorMessage = extractGraphApiError(error);

    logger.error("Instagram DM send failed", {
      recipientId,
      apiVersion: getGraphApiVersion(),
      error: errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

module.exports = {
  sendInstagramDM,
  getGraphApiVersion,
  getGraphApiBaseUrl,
  getAccessToken,
  buildMessagesEndpoint,
  buildDmPayload,
  extractGraphApiError
};
