const { createClient } = require("@supabase/supabase-js");

/**
 * Supabase client (singleton)
 * ---------------------------
 * Central place to configure Supabase so all services can reuse the same client.
 *
 * Note:
 * - Use the ANON key for client-style access (RLS still applies).
 * - For server-to-server privileged access you would use the SERVICE_ROLE key
 *   (never expose it to the browser).
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

/**
 * Create and export a single Supabase client instance.
 *
 * Important:
 * - `@supabase/supabase-js` throws if the key is missing.
 * - To keep the server bootable in dev (even before env vars are configured),
 *   we create the client only when both URL and key are present.
 */
let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // eslint-disable-next-line no-console
  console.warn(
    "[Supabase] SUPABASE_URL / SUPABASE_ANON_KEY not set. Supabase features disabled."
  );
}

module.exports = { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };

