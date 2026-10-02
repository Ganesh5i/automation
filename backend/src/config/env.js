const dotenv = require("dotenv");

// Load environment variables from .env (if present)
dotenv.config();

// ============================================================
// TEMPORARY META ENVIRONMENT DEBUG
// IMPORTANT: Never print actual tokens or secrets.
// ============================================================

console.log("=== META ENV CHECK ===");

console.log(
  "META_ACCESS_TOKEN:",
  process.env.META_ACCESS_TOKEN ? "SET" : "MISSING"
);

console.log(
  "META_ACCESS_TOKEN_LENGTH:",
  process.env.META_ACCESS_TOKEN?.length || 0
);

console.log(
  "META_APP_ID:",
  process.env.META_APP_ID ? "SET" : "MISSING"
);

console.log(
  "META_APP_SECRET:",
  process.env.META_APP_SECRET ? "SET" : "MISSING"
);

console.log(
  "META_IG_USER_ID:",
  process.env.META_IG_USER_ID || "MISSING"
);

console.log(
  "META_GRAPH_API_VERSION:",
  process.env.META_GRAPH_API_VERSION || "DEFAULT v21.0"
);

console.log(
  "SUPABASE_URL:",
  process.env.SUPABASE_URL ? "SET" : "MISSING"
);

console.log(
  "SUPABASE_ANON_KEY:",
  process.env.SUPABASE_ANON_KEY ? "SET" : "MISSING"
);

console.log(
  "GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY ? "SET" : "MISSING"
);

console.log("======================");

/**
 * Centralized environment reader.
 * Keeps all env access in one place for maintainability/testing.
 */
function required(name) {
  const value = process.env[name];

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    // In production you may want to fail fast for required secrets.
    // For this starter, we keep it non-fatal except for PORT.
    return "";
  }

  return value;
}

const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT || 3000),

  VERIFY_TOKEN: required("VERIFY_TOKEN"),

  // Meta configuration
  META_APP_ID: process.env.META_APP_ID || "",

  META_APP_SECRET: process.env.META_APP_SECRET || "",

  META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN || "",

  META_IG_USER_ID: process.env.META_IG_USER_ID || "",

  META_GRAPH_API_VERSION:
    process.env.META_GRAPH_API_VERSION || "v21.0",

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || "",

  SUPABASE_ANON_KEY:
    process.env.SUPABASE_ANON_KEY || "",

  // Gemini
  GEMINI_API_KEY:
    process.env.GEMINI_API_KEY || ""
});

module.exports = { env };