const Feedback = require('../models/feedbackModel');
const Transaction = require('../models/transactionModel');
const { analyzeSentiment } = require('../Services/sentimentService');

const createFeedback = async (req, res) => {
  const { transactionId, rating, comment } = req.body;

  const tx = await Transaction.findById(transactionId).populate('item');
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  if (tx.status !== 'completed') {
    return res.status(400).json({ message: 'Only completed transactions allowed' });
  }

  const sentiment = await analyzeSentiment(comment);

  const fb = await Feedback.create({
    transaction: tx._id,
    item: tx.item._id,
    reviewer: req.user._id,
    rating,
    comment,
    sentiment
  });

  res.status(201).json(fb);
};

/* ADMIN */
const getAllFeedback = async (req, res) => {
  const feedback = await Feedback.find()
    .populate('reviewer', 'email')
    .populate('item', 'title');

  res.json(feedback);
};

module.exports = { createFeedback, getAllFeedback };
