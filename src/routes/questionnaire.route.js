const express = require('express');
const router = express.Router();
const QuestionnaireController = require('../controllers/questionnaire.controller');

router.get('/getlastsq', QuestionnaireController.getLastStudentQuestionnaire);
router.get('/getlasttq', QuestionnaireController.getLastTutorQuestionnaire);
router.get('/all', QuestionnaireController.getAll);
router.get('/:id', QuestionnaireController.get);
router.post('/new', QuestionnaireController.new);
router.delete('/:id', QuestionnaireController.delete);
router.put('/:id', QuestionnaireController.update);

module.exports = router;