const mongoose = require('mongoose');
const Location = require('./location.model');

const userSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, required: true, lowercase: true, unique: true },
	password: { type: String, required: true },
	location: { type: Location.schema },
	type: { type: String, enum: ['Student', 'Tutor', 'Admin', 'None'], default: 'None', required: true },
	answers_vector: { 'q_id': { type: Number, ref: 'Questionnaire', required: true }, 'ans': [{ type: Number, required: true }] },
	weights_vector: { 'q_id': { type: Number, ref: 'Questionnaire', required: true }, 'wght': [{ type: Number, required: true }] },

	//for tutor
	courses: [{ type: Number, ref: 'Course' }],
	certificates: [{ type: Number, ref: 'Certificate' }],
	costPerHour: { type: Number },
	matchingGrade: { type: Number },
});

module.exports = User = mongoose.model('User', userSchema);