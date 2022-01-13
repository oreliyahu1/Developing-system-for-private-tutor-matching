const express = require('express');
const router = express.Router();
const FaqController = require('../controllers/faq.controller');

router.get('/all', FaqController.getAll);
router.get('/:id', FaqController.get);
router.post('/new', FaqController.new);
router.delete('/:id', FaqController.delete);
router.put('/:id', FaqController.update);

module.exports = router;