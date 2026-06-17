const express = require("express");
const { saveLead } = require("../services/lead.service");

/**
 * Lead test routes
 * ---------------
 * Temporary endpoints to validate Supabase integration during development.
 * You can later replace/extend these with real webhook-driven lead capture.
 */

const router = express.Router();

/**
 * POST /test-save
 *
 * Body example:
 * {
 *   "message": "LINK",
 *   "source": "keyword",
 *   "keyword": "LINK",
 *   "reply": "https://careersnap-sigma.vercel.app/"
 * }
 */
router.post("/test-save", async (req, res) => {
  try {
    const result = await saveLead(req.body || {});
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

module.exports = router;

