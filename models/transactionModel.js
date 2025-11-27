const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },      // item owner
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // who wants the item
  status: {
    type: String,
    enum: ['requested', 'accepted', 'declined', 'completed'],
    default: 'requested'
  },
  message: { type: String }  // optional note
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
