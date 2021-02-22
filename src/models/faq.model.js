const mongoose = require('mongoose');

//faq schema
const faqSchema = new mongoose.Schema({
	_id: {type: Number, required: true},
	question: {type: String, required: true, lowercase: true, unique: true},
	answer: {type: String, required: true, lowercase: true}
});

module.exports = Faq = mongoose.model('faq', faqSchema);