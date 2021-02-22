const mongoose = require('mongoose');
const Question = require('./question.model');

//questionnaire schema
const questionnaireSchema = new mongoose.Schema({
	_id: {type: Number, required: true},
	type: {type: String, enum : ['Student', 'Tutor'], required: true},
	questions:  [{type: Question.schema}],
	weights:  [{type: Number}]
});

module.exports = Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);