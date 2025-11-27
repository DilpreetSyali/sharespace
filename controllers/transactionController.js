const Transaction = require('../models/transactionModel');
const Item = require('../models/itemModel');

// POST /api/transactions
const createTransaction = async (req, res) => {
  const { itemId, message } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot request your own item' });
    }

    const tx = await Transaction.create({
      item: item._id,
      owner: item.owner,
      requester: req.user._id,
      message
    });

    item.status = 'reserved';
    await item.save();

    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/transactions/mine
const getMyTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find({ requester: req.user._id })
      .populate('item', 'title status')
      .populate('owner', 'name email');
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/transactions/owner
const getOwnerTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find({ owner: req.user._id })
      .populate('item', 'title status')
      .populate('requester', 'name email');
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/transactions/:id
const updateTransactionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // accepted / declined / completed

  try {
    const tx = await Transaction.findById(id).populate('item');
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    if (tx.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to modify this transaction' });
    }

    if (!['accepted', 'declined', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    tx.status = status;
    await tx.save();

    if (status === 'declined') {
      tx.item.status = 'available';
    } else if (status === 'completed') {
      tx.item.status = 'completed';
    }
    await tx.item.save();

    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTransaction,
  getMyTransactions,
  getOwnerTransactions,
  updateTransactionStatus
};
