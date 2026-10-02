const axios = require("axios");
const { env } = require("../config/env");
const { logger } = require("../utils/logger");

/**
 * Meta Access Token Manager
 * ---------------------------
 * Manages Meta access token lifecycle including:
 * - Token storage and retrieval
 * - Automatic token refresh before expiry
 * - Token validation
 *
 * According to Meta documentation:
 * https://developers.facebook.com/docs/marketing-api/system-users/install-apps-and-generate-tokens/
 *
 * Expiring system user tokens are valid for 60 days.
 * Should be refreshed within the 60-day window to maintain continuity.
 */

/** Token refresh buffer in days (refresh before full expiry) */
const REFRESH_BUFFER_DAYS = 10;

/** Token refresh interval in milliseconds (check every 24 hours) */
const REFRESH_CHECK_INTERVAL = 24 * 60 * 60 * 1000;

/**
 * In-memory token storage with expiry tracking.
 * In production, consider persisting to a database.
 */
let tokenState = {
  accessToken: env.META_ACCESS_TOKEN || "",
  expiresAt: null, // Date object or null
  lastRefreshedAt: null // Date object or null
};

/**
 * Get the current access token, refreshing if needed.
 *
 * @returns {Promise<string>} Valid access token
 */
async function getValidToken() {
  // If no token is configured, return empty string
  if (!tokenState.accessToken) {
    logger.warn("No access token configured");
    return "";
  }

  // If we don't have expiry info, try to validate the token
  if (!tokenState.expiresAt) {
    const isValid = await validateToken(tokenState.accessToken);
    if (isValid) {
      // Token is valid but we don't know expiry - set a default expiry of 60 days from now
      tokenState.expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
      logger.info("Token validated, expiry set to 60 days from now");
      return tokenState.accessToken;
    } else {
      // Token is invalid, try to refresh
      logger.warn("Token invalid, attempting refresh");
      const refreshed = await refreshToken();
      return refreshed || "";
    }
  }

  // Check if token is expired or needs refresh
  const now = new Date();
  const timeUntilExpiry = tokenState.expiresAt - now;
  const refreshThreshold = REFRESH_BUFFER_DAYS * 24 * 60 * 60 * 1000;

  if (timeUntilExpiry <= 0) {
    logger.warn("Token expired, attempting refresh");
    const refreshed = await refreshToken();
    return refreshed || "";
  }

  if (timeUntilExpiry <= refreshThreshold) {
    logger.info(`Token expires in ${Math.ceil(timeUntilExpiry / (24 * 60 * 60 * 1000))} days, refreshing`);
    const refreshed = await refreshToken();
    return refreshed || tokenState.accessToken;
  }

  // Token is valid and not near expiry
  return tokenState.accessToken;
}

/**
 * Validate a Meta access token using the debug_token endpoint.
 *
 * @param {string} token - Access token to validate
 * @returns {Promise<boolean>} True if token is valid
 */
async function validateToken(token) {
  if (!token || !env.META_APP_ID) {
    return false;
  }

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v21.0/debug_token`,
      {
        params: {
          input_token: token,
          access_token: `${env.META_APP_ID}|${env.META_APP_SECRET}`
        }
      }
    );

    const data = response.data?.data;
    if (!data) {
      return false;
    }

    const isValid = data.is_valid === true;
    
    // Update expiry if available from debug response
    if (data.expires_at) {
      tokenState.expiresAt = new Date(data.expires_at * 1000);
      logger.info("Token expiry updated from debug response", {
        expiresAt: tokenState.expiresAt
      });
    }

    return isValid;
  } catch (error) {
    logger.error("Token validation failed", {
      error: error.message
    });
    return false;
  }
}

/**
 * Refresh the Meta access token.
 *
 * According to Meta documentation for system user token refresh:
 * https://developers.facebook.com/docs/marketing-api/system-users/install-apps-and-generate-tokens/
 *
 * @returns {Promise<string|null>} New access token or null on failure
 */
async function refreshToken() {
  if (!tokenState.accessToken) {
    logger.error("Cannot refresh: no existing token");
    return null;
  }

  if (!env.META_APP_ID || !env.META_APP_SECRET) {
    logger.error("Cannot refresh: missing META_APP_ID or META_APP_SECRET");
    return null;
  }

  try {
    logger.info("Attempting token refresh");

    const response = await axios.get(
      `https://graph.facebook.com/v21.0/oauth/access_token`,
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: env.META_APP_ID,
          client_secret: env.META_APP_SECRET,
          set_token_expires_in_60_days: true,
          fb_exchange_token: tokenState.accessToken
        }
      }
    );

    const newToken = response.data?.access_token;
    const expiresIn = response.data?.expires_in; // seconds

    if (!newToken) {
      logger.error("Token refresh failed: no token in response");
      return null;
    }

    // Update token state
    tokenState.accessToken = newToken;
    tokenState.lastRefreshedAt = new Date();

    // Calculate expiry from expires_in (seconds)
    if (expiresIn) {
      tokenState.expiresAt = new Date(Date.now() + expiresIn * 1000);
      logger.info("Token refreshed successfully", {
        expiresAt: tokenState.expiresAt,
        expiresInDays: Math.round(expiresIn / (24 * 60 * 60))
      });
    } else {
      // Default to 60 days if expires_in not provided
      tokenState.expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
      logger.info("Token refreshed successfully (default 60-day expiry)", {
        expiresAt: tokenState.expiresAt
      });
    }

    return newToken;
  } catch (error) {
    logger.error("Token refresh failed", {
      error: error.message,
      response: error.response?.data
    });
    return null;
  }
}

/**
 * Initialize the token manager.
 * Validates the current token and sets up scheduled refresh.
 *
 * @returns {Promise<void>}
 */
async function initialize() {
  logger.info("Initializing token manager");

  if (!tokenState.accessToken) {
    logger.warn("No access token configured, token manager disabled");
    return;
  }

  // Validate current token
  const isValid = await validateToken(tokenState.accessToken);

  if (!isValid) {
    logger.warn("Current token is invalid, attempting refresh");
    const refreshed = await refreshToken();
    if (!refreshed) {
      logger.error("Failed to refresh invalid token. Please check META_ACCESS_TOKEN in .env");
      return;
    }
  }

  // Set up scheduled refresh check
  setInterval(async () => {
    try {
      await getValidToken();
    } catch (error) {
      logger.error("Scheduled token refresh check failed", {
        error: error.message
      });
    }
  }, REFRESH_CHECK_INTERVAL);

  logger.info("Token manager initialized", {
    expiresAt: tokenState.expiresAt,
    refreshCheckInterval: `${REFRESH_CHECK_INTERVAL / (60 * 60 * 1000)} hours`
  });
}

/**
 * Get current token state (for debugging/monitoring).
 *
 * @returns {{ accessToken: string, expiresAt: Date | null, lastRefreshedAt: Date | null }}
 */
function getTokenState() {
  return {
    accessToken: tokenState.accessToken ? "***REDACTED***" : "",
    expiresAt: tokenState.expiresAt,
    lastRefreshedAt: tokenState.lastRefreshedAt,
    hasToken: !!tokenState.accessToken
  };
}

/**
 * Manually set a new token (for testing or manual updates).
 *
 * @param {string} newToken - New access token
 * @param {number} [expiresInDays] - Optional expiry in days (default: 60)
 * @returns {void}
 */
function setToken(newToken, expiresInDays = 60) {
  tokenState.accessToken = newToken;
  tokenState.lastRefreshedAt = new Date();
  tokenState.expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  logger.info("Token manually updated", {
    expiresAt: tokenState.expiresAt
  });
}

module.exports = {
  getValidToken,
  validateToken,
  refreshToken,
  initialize,
  getTokenState,
  setToken
};
