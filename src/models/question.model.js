const mongoose = require('mongoose');

//question schema
const questionSchema = new mongoose.Schema({
	_id: {type: Number, required: true},
	name: {type: String, required: true},
	type: {type: String, enum : ['Student','Tutor', 'Both'], default: 'Both', required: true},
	grade_rate: { type: Number, default: 2 }
});

module.exports = Question = mongoose.model('Question', questionSchema);