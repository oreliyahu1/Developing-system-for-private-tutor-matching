const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/meeting.controller');

router.get('/all', MeetingController.getAll);
router.get('/:id', MeetingController.get);
router.get('/all/:id', MeetingController.getByUserId); //id is user, get all meetings for user
router.post('/new', MeetingController.new);
router.delete('/:id', MeetingController.delete);
router.put('/:id', MeetingController.update);

module.exports = router;