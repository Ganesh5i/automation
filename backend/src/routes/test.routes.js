const express = require("express");
const { processKeyword } = require("../services/keywordEngine");

/**
 * Test routes
 * -----------
 * Simple endpoint to validate the Keyword Engine behavior without needing
 * Instagram/Meta webhooks wired up yet.
 */

const router = express.Router();

/**
 * POST /test-keyword
 *
 * Body:
 *  { "message": "LINK" }
 *
 * Returns:
 *  { "type": "link", "reply": "..." }
 */
router.post("/test-keyword", (req, res) => {
  const message = req.body?.message;
  const result = processKeyword(message);
  return res.json(result);
});

module.exports = router;

