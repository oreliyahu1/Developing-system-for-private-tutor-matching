const mongoose = require('mongoose');

//course schema
const courseSchema = new mongoose.Schema({
	_id: {type: Number, required: true},
	name: {type: String, required: true, lowercase: true, unique: true}
});

module.exports = Course = mongoose.model('Course', courseSchema);