const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { getMessages, sendMessage } = require("../controllers/messageController");

router.get("/:conversationId", auth, getMessages);
router.post("/:conversationId", auth, sendMessage);

module.exports = router;