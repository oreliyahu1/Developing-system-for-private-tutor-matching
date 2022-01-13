const mongoose = require('mongoose');
const Location = require('./location.model');

const meetingSchema = new mongoose.Schema({
	_id: { type: Number, required: true },
	course: { type: Number, ref: 'Course', required: true },
	student: { type: Number, ref: 'User', required: true },
	tutor: { type: Number, ref: 'User', required: true },
	status: {
		type: String, enum: ['Request', 'Approved', 'Rejected', 'WaitingForFeedback10',
			'WaitingForFeedback01', 'Completed'], default: 'Request', required: true
	},
	time: { type: Date, required: true },
	location: { type: Location.schema }
});

module.exports = Meeting = mongoose.model('Meeting', meetingSchema);