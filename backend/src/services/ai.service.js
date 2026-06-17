/**
 * AI Service Layer
 * ----------------
 * This module is the single place where AI provider integrations should live.
 *
 * For now:
 * - This is a mock implementation (no external API calls).
 *
 * Later:
 * - Replace the mock with Gemini/OpenAI calls (and keep the rest of the app unchanged).
 */

/**
 * Generate an AI response for a prompt.
 *
 * NOTE: Mock provider only. No network calls are made.
 *
 * @param {string} prompt
 * @returns {Promise<{success: true, provider: "mock", reply: string} | {success: false, reply: string}>}
 */
async function generateAIResponse(prompt) {
  try {
    return {
      success: true,
      provider: "mock",
      reply: `AI response for: ${prompt}`
    };
  } catch (err) {
    // Safety fallback for unexpected failures
    return {
      success: false,
      reply: "Sorry, something went wrong."
    };
  }
}

module.exports = { generateAIResponse };

