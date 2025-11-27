const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getMyTransactions,
  getOwnerTransactions,
  updateTransactionStatus
} = require('../controllers/transactionController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createTransaction);
router.get('/mine', protect, getMyTransactions);
router.get('/owner', protect, getOwnerTransactions);
router.put('/:id', protect, updateTransactionStatus);

module.exports = router;
