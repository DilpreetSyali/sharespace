const Feedback = require('../models/feedbackModel');
const Transaction = require('../models/transactionModel');

const createFeedback = async (req, res) => {
  const { transactionId, rating, comment } = req.body;

  try {
    const tx = await Transaction.findById(transactionId).populate('item');
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.status !== 'completed') {
      return res.status(400).json({ message: 'Feedback allowed only for completed transactions' });
    }
    if (tx.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only requester can give feedback' });
    }

    // TODO later: call real ML service instead of this stub
    let sentiment = 'neutral';
    if (rating >= 4) sentiment = 'positive';
    else if (rating <= 2) sentiment = 'negative';

    const fb = await Feedback.create({
      transaction: tx._id,
      item: tx.item._id,
      reviewer: req.user._id,
      rating,
      comment,
      sentiment
    });

    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getItemFeedback = async (req, res) => {
  const { id } = req.params; // item id
  try {
    const feedbacks = await Feedback.find({ item: id })
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createFeedback, getItemFeedback };
