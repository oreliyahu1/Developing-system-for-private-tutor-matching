const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

router.get('/all',UserController.getAll);
router.get('/:id', UserController.get);
router.get('/suitabletutors/:id/:course',UserController.getSuitableTutors);
router.get('/calcgrade/:s_id/:t_id',UserController.calcMatchingGrade);
router.post('/forgotpassword', UserController.forgotpassword);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/signup', UserController.new);
router.put('/:id', UserController.update);

module.exports = router;