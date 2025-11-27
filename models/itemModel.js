const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // e.g. "books", "electronics"
  condition: { type: String, enum: ['like-new', 'good', 'fair', 'poor'], default: 'good' },
  isFree: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  location: { type: String, required: true }, // e.g. Hostel A
  images: [{ type: String }],                 // will store URLs later
  status: { type: String, enum: ['available', 'reserved', 'completed'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
