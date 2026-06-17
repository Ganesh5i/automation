const { supabase } = require("../config/supabase");

/**
 * Lead Service
 * ------------
 * Responsible for storing incoming leads in Supabase.
 *
 * Future-ready:
 * - Add validation, enrichment (UTM parsing), dedupe, and analytics events here.
 * - Keep DB concerns out of routes/controllers.
 */

/**
 * Save a lead record into the `leads` table.
 *
 * Expected columns (recommended) in Supabase `leads` table:
 * - message (text)
 * - source (text)  // e.g., "keyword" | "ai" | "instagram" etc.
 * - keyword (text) // e.g., "LINK" (optional)
 * - reply (text)   // the response sent back (optional)
 *
 * @param {{ message?: any, source?: any, keyword?: any, reply?: any }} payload
 * @returns {Promise<{success: true, data: any} | {success: false, error: any}>}
 */
async function saveLead({ message, source, keyword, reply }) {
  try {
    // If Supabase isn't configured yet, fail gracefully (server still runs).
    if (!supabase) {
      return {
        success: false,
        error: {
          message: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY."
        }
      };
    }

    // Minimal normalization. Keep it light for now; validate more strictly later.
    const row = {
      message: message ?? null,
      source: source ?? null,
      keyword: keyword ?? null,
      reply: reply ?? null
    };

    // Insert and return inserted row(s).
    const { data, error } = await supabase.from("leads").insert([row]).select();

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

module.exports = { saveLead };

