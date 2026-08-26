const { createClient } = require("@supabase/supabase-js");

/**
 * Supabase configuration
 */

const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
const SUPABASE_ANON_KEY = (process.env.SUPABASE_ANON_KEY || "").trim();

// Safe diagnostics - does NOT expose the API key
console.log("[Supabase] Configuration check:", {
  url: SUPABASE_URL,
  hasKey: Boolean(SUPABASE_ANON_KEY),
  keyLength: SUPABASE_ANON_KEY.length
});

let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log("[Supabase] Client created successfully");
} else {
  console.warn(
    "[Supabase] SUPABASE_URL / SUPABASE_ANON_KEY not set. Supabase features disabled."
  );
}

module.exports = {
  supabase,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
};