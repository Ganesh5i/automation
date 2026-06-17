const dotenv = require("dotenv");

// Load environment variables from .env (if present)
dotenv.config();

/**
 * Centralized environment reader.
 * Keeps all env access in one place for maintainability/testing.
 */
function required(name) {
  const value = process.env[name];
  if (value === undefined || value === null || value === "") {
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
  META_APP_ID: process.env.META_APP_ID || "",
  META_APP_SECRET: process.env.META_APP_SECRET || "",
  META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN || "",
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ""
});

module.exports = { env };

