const mongoose = require('mongoose');

//certificate schema
const certificateSchema = new mongoose.Schema({
	_id: {type: Number, required: true},
	name: {type: String, required: true, lowercase: true, unique: true}
});

module.exports = Certificate = mongoose.model('Certificate', certificateSchema);