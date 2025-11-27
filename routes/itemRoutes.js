const express = require('express');
const router = express.Router();
const { createItem, getItems, updateItem ,  deleteItem } = require('../controllers/itemController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createItem);
router.get('/', getItems);
router.put('/:id', protect, updateItem); // new
router.delete('/:id', protect, deleteItem);
module.exports = router;
