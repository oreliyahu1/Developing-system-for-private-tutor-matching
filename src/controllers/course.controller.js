const Course = require('../models/course.model');
const User = require('../models/user.model');
const syncUserOn = require('./sync.controller').syncOn;
const Counter = require('../models/counter.model');

//init courses schema => _id is increment key
var counter = new Counter({_id: Course.collection.collectionName});
counter.save(err => {
	if(err) console.log('Counter of courses is already exists');
});

exports.getAll = function (req, res) {
	Course.find({}, (err, result) => {
		if(err) return res.json({response : 'Error'});
		return res.json(result);
	});
};

exports.get = function (req, res) {
	Course.findById(Number(req.params.id), (err, result) => {
		if(err) return res.json({response : 'Error'});
		return res.json(result);
	});
};

exports.new = function (req, res) {
	Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
		if(err) return res.json({response : 'Error'});
		
		req.body._id = result.seq;
		var newcourse = new Course(req.body);
		newcourse.save((err, result) => {
			if(err) return res.json({response : 'Error', msg : 'Course name already exist'});
			return res.json({response : 'Success', msg : 'Course number ' + result._id + ' has been added'}); 
		});
	});
};

exports.delete = function (req, res) {
	Course.findByIdAndRemove(Number(req.params.id), (err, result) => {
		if (err) return res.json({response : 'Error'});
		if(result == null) return res.json({response : 'Error', msg : 'Course doesnt exist'}); 

		User.find({ courses: {$in: [Number(req.params.id)]} }, (err, result) => {
			if(err || result == null) return res.json({response : 'Error'});
			for(let i = 0; i < result.length; i++) {
				syncUserOn(result[i]._id);
			}

			User.updateMany({}, { $pull: { courses: {$in: [Number(req.params.id)]} }}, {multi: true}, (err, result) => {
				if(err) return res.json({response : 'Error'});
				return res.json({response : 'Success', msg : 'Course number ' + Number(req.params.id) + ' has been deleted'}); 
			});
		});
	});
};

exports.update = function (req, res) {
	req.body._id = Number(req.params.id);
	var updatecourse =  new Course(req.body);
	Course.findByIdAndUpdate(Number(req.params.id), { $set: updatecourse }, (err, result) => {
		if(err) return res.json({response : 'Error'});
		if(result == null) return res.json({response : 'Error', msg : 'Course doesnt exist'}); 
		return res.json({response : 'Success', msg : 'Course number ' + updatecourse._id + ' has been updated'}); 
	});
};