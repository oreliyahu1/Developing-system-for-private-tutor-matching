const Questionnaire = require('../models/questionnaire.model');
const Counter = require('../models/counter.model');

//init questionnaire schema => _id is increment key
var counter = new Counter({_id: Questionnaire.collection.collectionName});
counter.save(err => {
	if(err) console.log('Counter of questionnaire is already exists');
});

exports.getAll = function (req, res) {
	Questionnaire.find({}, (err, result) => {
		if(err) return res.json({response : 'Error2'});
		return res.json(result);
	});
};

exports.getLastStudentQuestionnaire = function(req, res) {
	Questionnaire.findOne({'type': 'Student'}).sort({'_id': -1}).exec(function(err,result) {
		if(err || result == null) return res.json({response : "Er1ror"});
		res.json(result);
	});
};

exports.getLastTutorQuestionnaire = function(req, res) {
	Questionnaire.findOne({'type': 'Tutor'}).sort({'_id': -1}).exec(function(err,result) {
		if(err || result == null) return res.json({response : "Err1or"});
		res.json(result);
	});
};

exports.get = function (req, res) {
	Questionnaire.findById(Number(req.params.id), (err, result) => {
		if(err) return res.json({response : 'Error'});
		return res.json(result);
	});
};

exports.new = function (req, res) {
	Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
		if(err) return res.json({response : 'Error'});
		
		req.body._id = result.seq;
		var newquestionnaire = new Questionnaire(req.body);
		newquestionnaire.save((err, result) => {
			if(err) return res.json({response : 'Error'});
			return res.json({response : 'Success', msg : 'Questionnaire number ' + result._id + ' has been added'}); 
		});
	});
};

exports.delete = function (req, res) {
	Questionnaire.findByIdAndRemove(Number(req.params.id), (err, result) => {
		if (err) return res.json({response : 'Error'});
		if(result == null) return res.json({response : 'Error', msg : 'Questionnaire doesnt exist'}); 
		return res.json({response : 'Success', msg : 'Questionnaire number ' + Number(result._id) + ' has been deleted'}); 
	});
};

exports.update = function (req, res) {
	req.body._id = Number(req.params.id);
	var updatequestionnaire =  new Questionnaire(req.body);
	Questionnaire.findByIdAndUpdate(Number(req.params.id), { $set: updatequestionnaire }, (err, result) => {
		if(err) return res.json({response : 'Error'});
		if(result == null) return res.json({response : 'Error', msg : 'Questionnaire doesnt exist'}); 
		return res.json({response : 'Success', msg : 'Questionnaire number ' + updatequestionnaire._id + ' has been updated'}); 
	});
};