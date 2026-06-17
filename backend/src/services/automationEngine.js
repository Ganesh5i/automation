const { processKeyword } = require("./keywordEngine");
const { generateAIResponse } = require("./ai.service");

/**
 * Automation Engine
 * -----------------
 * Orchestrates how an incoming message should be handled.
 *
 * Today:
 * - Uses Keyword Engine for simple command-style messages.
 * - Falls back to an AI "prompt" payload for unknown messages.
 *
 * Future:
 * - Plug Gemini (or any LLM) in the "ai" branch without changing routes/controllers.
 */

/**
 * Normalize an incoming message to a safe, comparable string.
 * Kept as a small helper so we can evolve normalization rules later
 * (e.g., collapse whitespace, remove emojis, language detection, etc.).
 *
 * @param {unknown} message
 * @returns {string}
 */
function normalizeMessage(message) {
  return String(message ?? "").trim();
}

/**
 * Process an incoming message and return a consistent response envelope.
 *
 * @param {unknown} message
 * @returns {Promise<
 *  | { success: true, source: "keyword", data: { type: "link"|"job"|"pdf"|"help", reply: string } }
 *  | { success: true, source: "ai", data: { success: boolean, provider?: string, reply: string } }
 *  | { success: false, message: "Automation Engine Error" }
 * >}
 */
async function processIncomingMessage(message) {
  try {
    // 1) Normalize input
    const normalizedMessage = normalizeMessage(message);

    // 2) Evaluate keyword logic (fast path)
    const result = processKeyword(normalizedMessage);

    // 3) For known keyword types, return keyword source envelope
    if (["link", "job", "pdf", "help"].includes(result.type)) {
      return {
        success: true,
        source: "keyword",
        data: result
      };
    }

    // 4) For unknown keywords, fall back to AI processing.
    // This is intentionally delegated to the AI service layer so we can
    // swap the mock provider with Gemini/OpenAI later without refactoring.
    const prompt = normalizedMessage;
    const aiResult = await generateAIResponse(prompt);

    return {
      success: true,
      source: "ai",
      data: aiResult
    };
  } catch (err) {
    // 5) Catch-all safety net: do not leak internal errors to clients
    return {
      success: false,
      message: "Automation Engine Error"
    };
  }
}

module.exports = { processIncomingMessage };

