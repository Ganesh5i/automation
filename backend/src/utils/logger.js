/**
 * Minimal, dependency-free logger.
 * - Timestamps on every line
 * - Consistent log levels
 * - Easy to replace later with Winston/Pino without touching app code
 */
function timestamp() {
  return new Date().toISOString();
}

function format(level, message, meta) {
  const base = `[${timestamp()}] [${level}] ${message}`;
  if (meta === undefined) return base;
  if (meta instanceof Error) return `${base}\n${meta.stack || meta.message}`;
  try {
    return `${base} ${JSON.stringify(meta)}`;
  } catch {
    return `${base} ${String(meta)}`;
  }
}

const logger = {
  info(message, meta) {
    // eslint-disable-next-line no-console
    console.log(format("INFO", message, meta));
  },
  warn(message, meta) {
    // eslint-disable-next-line no-console
    console.warn(format("WARN", message, meta));
  },
  error(message, meta) {
    // eslint-disable-next-line no-console
    console.error(format("ERROR", message, meta));
  },
  debug(message, meta) {
    if ((process.env.LOG_LEVEL || "").toLowerCase() === "debug") {
      // eslint-disable-next-line no-console
      console.log(format("DEBUG", message, meta));
    }
  }
};

module.exports = { logger };

