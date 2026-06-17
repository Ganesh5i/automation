const express = require("express");
const { processIncomingMessage } = require("../services/automationEngine");

/**
 * Automation routes
 * -----------------
 * Provides a simple endpoint to test the Automation Engine without needing
 * any external platform integration (Meta/Instagram/etc.).
 */

const router = express.Router();

/**
 * POST /test-automation
 *
 * Body:
 *  { "message": "LINK" }
 *
 * Returns:
 *  { success: true, source: "keyword"|"ai", data: ... }
 */
router.post("/test-automation", async (req, res) => {
  try {
    const message = req.body?.message;
    const result = await processIncomingMessage(message);
    return res.json(result);
  } catch (err) {
    // Requirement: explicit 500 handler for unexpected route-level failures
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

module.exports = router;

