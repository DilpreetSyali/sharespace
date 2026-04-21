const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  createOrGetConversation,
  getMyConversations,
  markConversationAsSeen,
} = require("../controllers/conversationController");

router.post("/", auth, createOrGetConversation);
router.get("/", auth, getMyConversations);
router.patch("/:conversationId/seen", auth, markConversationAsSeen);

module.exports = router;