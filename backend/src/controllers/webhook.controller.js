async function receiveWebhook(req, res) {
  try {
    logger.info("========== RAW WEBHOOK ==========");
    logger.info(JSON.stringify(req.body, null, 2));
    logger.info("=================================");

    logger.info("Webhook received", {
      object: req.body?.object ?? "unknown"
    });

    const comment = extractCommentFromPayload(req.body);

    // IMPORTANT:
    // Only Instagram comment events should enter the automation engine.
    // Ignore message echoes, read receipts, delivery events, and other webhook events.
    if (!comment.hasComment) {
      logger.info("Ignoring non-comment webhook event", {
        object: req.body?.object ?? "unknown"
      });

      return res.status(200).json({
        success: true,
        ignored: true
      });
    }

    // Valid Instagram comment received
    logger.info("Comment payload extracted", {
      username: comment.username,
      userId: comment.userId,
      commentId: comment.commentId,
      mediaId: comment.mediaId,
      commentText: comment.commentText
    });

    // Process only real comment events
    const automationResult = await processIncomingMessage(
      comment.commentText,
      comment.userId,
      {
        username: comment.username,
        commentId: comment.commentId,
        mediaId: comment.mediaId
      }
    );

    return res.status(200).json(automationResult);
  } catch (err) {
    logger.error("Webhook processing error", {
      message: err instanceof Error ? err.message : String(err)
    });

    // Meta should receive HTTP 200 even if internal processing fails
    return res.status(200).json({
      success: false,
      message: "Webhook processed with errors"
    });
  }
}