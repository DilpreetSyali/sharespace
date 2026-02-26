const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // ✅ important: store college ID so we can filter campus feed
    collegeID: { type: String, required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    category: { type: String, required: true, trim: true }, // books, electronics etc.
    condition: {
      type: String,
      enum: ["like-new", "good", "fair", "poor"],
      default: "good",
    },

    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },

    location: { type: String, required: true, trim: true },

    images: [{ type: String }],

    status: {
      type: String,
      enum: ["available", "reserved", "completed"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);