const { supabase } = require("../config/supabase");
const { logger } = require("../utils/logger");

/**
 * Supabase Service
 * ----------------
 * Read-only Supabase queries for CareerSnap automation.
 *
 * Uses the shared client from `src/config/supabase.js`.
 * Expected `jobs` table columns: search_code, title, company, job_link.
 */

/**
 * Fetch a job record by CareerSnap search code (e.g. CS001).
 *
 * @param {string} code - Search code from user comment (e.g. "CS001")
 * @returns {Promise<{ title: string, company: string, job_link: string }>}
 */
async function getJobBySearchCode(code) {
  try {
    if (!supabase) {
      logger.warn("Supabase lookup skipped", {
        searchCode: code,
        reason: "Supabase not configured"
      });

      return {
        title: "",
        company: "",
        job_link: ""
      };
    }

    const normalizedCode = String(code ?? "").trim().toUpperCase();

    const { data, error } = await supabase
      .from("jobs")
      .select("title, company, job_link")
      .eq("search_code", normalizedCode)
      .maybeSingle();

    if (error) {
      logger.error("Supabase query error", {
        searchCode: normalizedCode,
        message: error.message
      });

      return {
        title: "",
        company: "",
        job_link: ""
      };
    }

    if (!data) {
      return {
        title: "",
        company: "",
        job_link: ""
      };
    }

    return {
      title: data.title ?? "",
      company: data.company ?? "",
      job_link: data.job_link ?? ""
    };
  } catch (err) {
    logger.error("Supabase lookup exception", {
      searchCode: code,
      message: err instanceof Error ? err.message : String(err)
    });

    return {
      title: "",
      company: "",
      job_link: ""
    };
  }
}

module.exports = { getJobBySearchCode };
