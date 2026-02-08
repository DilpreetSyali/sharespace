const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const { createFeedback, getAllFeedback } = require('../controllers/feedbackController');

router.post('/', auth, createFeedback);

/* ADMIN */
router.get('/', auth, adminOnly, getAllFeedback);

module.exports = router;
