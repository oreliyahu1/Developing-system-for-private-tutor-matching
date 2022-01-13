const mongoose = require('mongoose');

//counter model used for treatment id
const counterSchema = new mongoose.Schema({
	_id: {type: String, required: true},
	seq: { type: Number, default: 0 }
});

module.exports = Counter = mongoose.model('Counter', counterSchema);
