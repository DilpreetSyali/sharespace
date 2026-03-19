const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  createOrGetConversation,
  getMyConversations,
} = require("../controllers/conversationController");

router.post("/", auth, createOrGetConversation);
router.get("/", auth, getMyConversations);

module.exports = router;