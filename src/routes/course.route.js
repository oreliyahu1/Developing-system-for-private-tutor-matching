const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course.controller');

router.get('/all', CourseController.getAll);
router.get('/:id', CourseController.get);
router.post('/new', CourseController.new);
router.delete('/:id', CourseController.delete);
router.put('/:id', CourseController.update);

module.exports = router;