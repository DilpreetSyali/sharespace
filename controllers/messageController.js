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

    if (String(conversation.buyer) === String(userId)) {
      conversation.buyerLastSeenAt = new Date();
    } else {
      conversation.sellerLastSeenAt = new Date();
    }

    await conversation.save();

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text, type, location } = req.body;
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

    let messageData = {
      conversation: conversationId,
      sender: userId,
      type: type || "text",
    };

    if (type === "location") {
      if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
        return res.status(400).json({ message: "Valid location is required" });
      }

      messageData.location = {
        lat: location.lat,
        lng: location.lng,
        label: location.label || "Shared Location",
      };
      messageData.text = "📍 Shared a location";
    } else {
      if (!text || !text.trim()) {
        return res.status(400).json({ message: "Message text is required" });
      }
      messageData.text = text.trim();
    }

    const message = await Message.create(messageData);

    conversation.lastMessage = messageData.text;
    conversation.lastMessageSender = userId;
    conversation.updatedAt = new Date();

    if (String(conversation.buyer) === String(userId)) {
      conversation.buyerLastSeenAt = new Date();
    } else {
      conversation.sellerLastSeenAt = new Date();
    }

    await conversation.save();

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