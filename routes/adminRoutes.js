const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const User = require('../models/userModel');
const Item = require('../models/itemModel');
const Transaction = require('../models/transactionModel');
const Feedback = require('../models/feedbackModel');

router.get('/stats', auth, adminOnly, async (req, res) => {
  res.json({
    users: await User.countDocuments(),
    items: await Item.countDocuments(),
    transactions: await Transaction.countDocuments(),
    feedback: await Feedback.countDocuments()
  });
});

module.exports = router;
