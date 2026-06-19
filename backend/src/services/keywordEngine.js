/**
 * Keyword Engine
 * --------------
 * Maps simple command-style keywords to structured JSON replies.
 *
 * Supported keywords: LINK, HELP, PDF, JOB (case-insensitive, trimmed).
 * Also detects CareerSnap search codes (e.g. CS001, CS999).
 * Unknown input returns a minimal AI-routing payload for the Automation Engine.
 */

/**
 * Regex for CareerSnap job search codes: CS + exactly 3 digits (CS001–CS999).
 */
const SEARCH_CODE_REGEX = /^CS\d{3}$/i;

/**
 * Normalize user input for keyword matching.
 * Trims whitespace and converts to uppercase for case-insensitive comparison.
 *
 * @param {unknown} message - Raw incoming message
 * @returns {string} Normalized keyword string
 */
function normalizeKeywordInput(message) {
  return String(message ?? "").trim().toUpperCase();
}

/**
 * Build a structured keyword response envelope.
 *
 * @param {"link"|"job"|"pdf"|"help"} type - Keyword category
 * @param {string} reply - Reply text or URL to send back
 * @returns {{ success: true, source: "keyword", data: { type: string, reply: string } }}
 */
function buildKeywordResponse(type, reply) {
  return {
    success: true,
    source: "keyword",
    data: {
      type,
      reply
    }
  };
}

/**
 * Keyword reply map — single source of truth for supported commands.
 */
const KEYWORD_MAP = {
  LINK: buildKeywordResponse("link", "https://careersnap-sigma.vercel.app"),
  JOB: buildKeywordResponse("job", "Here are today's latest jobs."),
  PDF: buildKeywordResponse("pdf", "Here is your PDF download link."),
  HELP: buildKeywordResponse("help", "Reply with LINK, JOB or PDF.")
};

/**
 * Detect a CareerSnap search code in a normalized message.
 * Matches patterns like CS001, CS002, CS100, CS999 (case-insensitive).
 *
 * @param {string} normalized - Already trimmed and uppercased input
 * @returns {{ type: "search_code", code: string } | null}
 */
function detectSearchCode(normalized) {
  if (SEARCH_CODE_REGEX.test(normalized)) {
    return {
      type: "search_code",
      code: normalized
    };
  }

  return null;
}

/**
 * Process a user message and return a structured keyword or search-code response.
 *
 * @param {string} message - Incoming text (e.g. Instagram comment)
 * @returns {{ success: true, source: "keyword", data: { type: string, reply: string } } | { type: "search_code", code: string } | { type: "ai", reply: null }}
 */
function processKeyword(message) {
  const normalized = normalizeKeywordInput(message);

  // Return structured JSON for known keywords
  if (KEYWORD_MAP[normalized]) {
    return KEYWORD_MAP[normalized];
  }

  // Detect CareerSnap search codes before AI fallback
  const searchCode = detectSearchCode(normalized);
  if (searchCode) {
    return searchCode;
  }

  // Unknown input: signal Automation Engine to route to AI
  return {
    type: "ai",
    reply: null
  };
}

module.exports = { processKeyword, normalizeKeywordInput, buildKeywordResponse, detectSearchCode };
