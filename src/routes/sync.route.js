const express = require('express');
const router = express.Router();
const SyncController = require('../controllers/sync.controller');

router.get('/:id', SyncController.appsync);

module.exports = router;