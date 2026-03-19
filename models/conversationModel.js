const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ item: 1, buyer: 1, seller: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", conversationSchema);