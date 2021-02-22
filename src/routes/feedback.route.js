const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedback.controller');

router.get('/all', FeedbackController.getAll);
router.get('/:id', FeedbackController.get);
router.post('/new', FeedbackController.new);
router.delete('/:id', FeedbackController.delete);
router.put('/:id', FeedbackController.update);

module.exports = router;