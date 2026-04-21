const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    collegeID: { type: String, required: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    category: { type: String, required: true, trim: true },
    condition: {
      type: String,
      enum: ["like-new", "good", "fair", "poor"],
      default: "good",
    },

    isFree: { type: Boolean, default: true },
    price: { type: Number, default: 0 },

    location: { type: String, required: true, trim: true },

    images: [{ type: String }],

    hashtags: {
      type: [String],
      default: [],
      set: (tags) => {
        if (!Array.isArray(tags)) return [];
        return [...new Set(
          tags
            .map((tag) => String(tag).trim().toLowerCase().replace(/^#/, ""))
            .filter(Boolean)
        )];
      },
    },

    status: {
      type: String,
      enum: ["available", "reserved", "completed"],
      default: "available",
    },
  },
  { timestamps: true }
);

itemSchema.index({ title: "text", description: "text", hashtags: "text" });

module.exports = mongoose.model("Item", itemSchema);