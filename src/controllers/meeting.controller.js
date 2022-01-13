const Meeting = require('../models/meeting.model');
const Counter = require('../models/counter.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

//init meeting schema => _id is increment key
var counter = new Counter({_id: Meeting.collection.collectionName});
counter.save(err => {
	if(err) console.log('Counter of meeting is already exists');
});

exports.getAll = function (req, res) {
	Meeting.find({}, (err, result) => {
		if(err) return res.json({response : 'Error'});
		return res.json(result);
	});
};

exports.get = function (req, res) {
	Meeting.findById(Number(req.params.id), (err, result) => {
		if(err) return res.json({response : 'Error'});
		return res.json(result);
	});
};

exports.getByUserId = function (req, res){
	uid = Number(req.params.id);
	Meeting.find({ $or: [ { student: uid }, { tutor: uid } ] }, (err, meetings)=>{
		if(err || meetings == null) return res.json({response : "error"});
		async function queryMeetings(meetings, uid){
			const user = await User.findById(uid);
			for (meeting of meetings) {
				meeting.student = meeting.student._id == user._id ? user : await User.findById(meeting.student);
				meeting.tutor = meeting.tutor._id == user._id ? user : await User.findById(meeting.tutor);
				meeting.course = await Course.findById(meeting.course);
				meeting.student.password = meeting.tutor.password = null;
			}
			return res.json(meetings);
		}
		queryMeetings(meetings, uid);
	});
};

exports.new = function (req, res) {	
	Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
		if(err) return res.json({response : 'Error2'});
		req.body._id = result.seq;

		Course.findOne({name: req.body.course}, (err, result) => {
			if(err || result == null) return res.json({response : 'Error'});
			req.body.course = result;
			var newmeeting = new Meeting(req.body);
			newmeeting.save((err, result) => {
				if(err) return res.json({response : 'Error', msg: err});
				return res.json({response : 'Success', msg : 'Meeting number ' + result._id + ' has been added'}); 
			});
		});
		
		
	});
};

exports.delete = function (req, res) {
	Meeting.findByIdAndRemove(Number(req.params.id), (err, result) => {
		if (err) return res.json({response : 'Error'});
		if (result == null) return res.json({response : 'Error', msg : 'Meeting doesnt exist'}); 
		return res.json({response : 'Success', msg : 'Meeting number ' + Number(result._id) + ' has been deleted'}); 
	});
};

exports.update = function (req, res) {
	req.body._id = Number(req.params.id);
	var updatemeeting =  new Meeting(req.body);
	Meeting.findByIdAndUpdate(Number(req.params.id), { $set: updatemeeting }, (err, result) => {
		if (err) return res.json({response : 'Error'});
		if (result == null) return res.json({response : 'Error', msg : 'Meeting doesnt exist'}); 
		return res.json({response : 'Success', msg : 'Meeting number ' + updatemeeting._id + ' has been updated'}); 
	});
};