const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const {
  createTransaction,
  getMyTransactions,
  getOwnerTransactions,
  updateTransactionStatus,
  getAllTransactions
} = require('../controllers/transactionController');

router.post('/', auth, createTransaction);
router.get('/mine', auth, getMyTransactions);
router.get('/owner', auth, getOwnerTransactions);
router.put('/:id', auth, updateTransactionStatus);

/* ADMIN */
router.get('/', auth, adminOnly, getAllTransactions);

module.exports = router;
