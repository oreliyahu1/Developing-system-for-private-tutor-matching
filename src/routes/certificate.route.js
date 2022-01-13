const express = require('express');
const router = express.Router();
const CertificateController = require('../controllers/certificate.controller');

router.get('/all', CertificateController.getAll);
router.get('/:id', CertificateController.get);
router.post('/new', CertificateController.new);
router.delete('/:id', CertificateController.delete);
router.put('/:id', CertificateController.update);

module.exports = router;