/**
 * Keyword Engine
 * --------------
 * A tiny service that maps simple "commands" (keywords) to structured replies.
 *
 * Why this exists:
 * - Keeps keyword logic out of controllers/routes
 * - Makes it easy to extend later (more keywords, localization, analytics, etc.)
 */

/**
 * Process a user message and return a normalized reply instruction.
 *
 * Rules:
 * - Convert input to uppercase and trim spaces
 * - Match supported keywords via switch-case
 * - Unknown keywords fall back to AI handling
 *
 * @param {string} message - Incoming text message from user (e.g. IG comment/DM)
 * @returns {{type: "link"|"job"|"pdf"|"help"|"ai", reply: string|null}}
 */
function processKeyword(message) {
  // Normalize the input so comparisons are consistent.
  // We also protect against non-string inputs by coercing to string.
  const normalized = String(message ?? "").trim().toUpperCase();

  switch (normalized) {
    case "LINK":
      return {
        type: "link",
        reply: "https://careersnap-sigma.vercel.app/"
      };

    case "JOB":
      return {
        type: "job",
        reply: "Here are today's latest jobs."
      };

    case "PDF":
      return {
        type: "pdf",
        reply: "Here is your PDF download link."
      };

    case "HELP":
      return {
        type: "help",
        reply: "Reply with LINK, JOB or PDF."
      };

    default:
      // Unknown keyword: route to future AI module (Gemini/Chatbot/etc.)
      return {
        type: "ai",
        reply: null
      };
  }
}

module.exports = { processKeyword };

