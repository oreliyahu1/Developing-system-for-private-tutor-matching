const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
	_id: {type: Number, required: true},
	meeting: {type: Number, required: true},
	from_user: { type: Number, ref: 'User', required: true},
	to_user: { type: Number, ref: 'User', required: true},
	type: {type: String, enum : ['STT', 'TTS'], required: true},
	good: {type: Boolean, required: true},

	from_user_feedback_answers_vector: {'q_id': { type: Number, ref: 'Questionnaire', required: true}, 'ans': [{type: Number, required: true}]},

	from_user_current_answers_vector: {'q_id': { type: Number, ref: 'Questionnaire'}, 'ans': [{type: Number}]},
	from_user_current_weights_vector: {'q_id': { type: Number, ref: 'Questionnaire'}, 'wght': [{type: Number}]}, 
	to_user_current_answers_vector: {'q_id': { type: Number, ref: 'Questionnaire'}, 'ans': [{type: Number}]},
	to_user_current_weights_vector: {'q_id': { type: Number, ref: 'Questionnaire'}, 'wght': [{type: Number}]},

	calculated: {type: Boolean, default: false},
	cross_calculated: {type: Boolean, default: false},
});

module.exports = Feedback = mongoose.model('Feedback', feedbackSchema); 