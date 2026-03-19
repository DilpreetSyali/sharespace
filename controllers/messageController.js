const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?._id || req.user?.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const allowed =
      String(conversation.buyer) === String(userId) ||
      String(conversation.seller) === String(userId);

    if (!allowed) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const allowed =
      String(conversation.buyer) === String(userId) ||
      String(conversation.seller) === String(userId);

    if (!allowed) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      text: text.trim(),
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    const populated = await Message.findById(message._id).populate("sender", "name email");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};