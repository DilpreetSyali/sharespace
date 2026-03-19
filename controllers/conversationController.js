const Conversation = require("../models/conversationModel");
const Item = require("../models/itemModel");

const createOrGetConversation = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const item = await Item.findById(itemId).populate("owner", "_id name email");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const sellerId = item.owner?._id || item.owner;

    if (String(userId) === String(sellerId)) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    let conversation = await Conversation.findOne({
      item: itemId,
      buyer: userId,
      seller: sellerId,
    })
      .populate("item", "title images price isFree")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    if (!conversation) {
      conversation = await Conversation.create({
        item: itemId,
        buyer: userId,
        seller: sellerId,
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("item", "title images price isFree")
        .populate("buyer", "name email")
        .populate("seller", "name email");
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getMyConversations = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const conversations = await Conversation.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .populate("item", "title images price isFree")
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createOrGetConversation,
  getMyConversations,
};