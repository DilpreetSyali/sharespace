const express = require('express');
const router = express.Router();
const { createFeedback, getItemFeedback } = require('../controllers/feedbackController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createFeedback);      // POST /api/feedback
router.get('/item/:id', getItemFeedback);      // GET  /api/feedback/item/:id

module.exports = router;
