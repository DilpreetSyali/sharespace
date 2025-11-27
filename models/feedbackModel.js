const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  item:        { type: mongoose.Schema.Types.ObjectId, ref: 'Item',         required: true },
  reviewer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',         required: true },
  rating:      { type: Number, min: 1, max: 5, required: true },   // label for ML
  comment:     { type: String, required: true },                   // text for sentiment
  sentiment:   { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
