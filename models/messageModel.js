const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "location"],
      default: "text",
    },
    text: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      label: { type: String, default: "Shared Location" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);