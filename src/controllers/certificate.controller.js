const Certificate = require('../models/certificate.model');
const User = require('../models/user.model');
const syncUserOn = require('./sync.controller').syncOn;
const Counter = require('../models/counter.model');

//init certificate schema => _id is increment key
var counter = new Counter({_id: Certificate.collection.collectionName});
counter.save(err => {
	if(err) console.log('Counter of certificates is already exists');
});

exports.getAll = function (req, res) {
	Certificate.find({}, (err, result) => {
		if(err) return res.json({response : 'Error'});
		return res.json(result);
	});
};

exports.get = function (req, res) {
	Certificate.findById(Number(req.params.id), (err, result) => {
		if(err) return res.json({response : 'Error'});
		return res.json(result);
	});
};

exports.new = function (req, res) {
	Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
		if(err) return res.json({response : 'Error'});
		
		req.body._id = result.seq;
		var newcertificate = new Certificate(req.body);
		newcertificate.save((err, result) => {
			if(err) return res.json({response : 'Error', msg : 'Certificate name already exist'});
			return res.json({response : 'Success', msg : 'Certificate number ' + result._id + ' has been added'}); 
		});
	});
};

exports.delete = function (req, res) {
	Certificate.findByIdAndRemove(Number(req.params.id), (err, result) => {
		if (err) return res.json({response : 'Error'});
		if(result == null) return res.json({response : 'Error', msg : 'Certificate doesnt exist'}); 

		User.find({ certificates: {$in: [Number(req.params.id)]} }, (err, result) => {
			if(err || result == null) return res.json({response : 'Error'});
			for(let i = 0; i < result.length; i++) {
				syncUserOn(result[i]._id);
			}

			User.updateMany({}, { $pull: { certificates: {$in: [Number(req.params.id)]} }}, {multi: true}, (err, result) => {
				if(err) return res.json({response : 'Error'});
				return res.json({response : 'Success', msg : 'Certificate number ' + Number(req.params.id) + ' has been deleted'}); 
			});
		});

	});
};

exports.update = function (req, res) {
	req.body._id = Number(req.params.id);
	var updatecertificate =  new Certificate(req.body);
	Certificate.findByIdAndUpdate(Number(req.params.id), { $set: updatecertificate }, (err, result) => {
		if(err) return res.json({response : 'Error'});
		if(result == null) return res.json({response : 'Error', msg : 'Certificate doesnt exist'}); 
		return res.json({response : 'Success', msg : 'Certificate number ' + updatecertificate._id + ' has been updated'}); 
	});
};