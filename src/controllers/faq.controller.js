const Faq = require('../models/faq.model');
const Counter = require('../models/counter.model');

//init faq schema => _id is increment key
var counter = new Counter({_id: Faq.collection.collectionName});
counter.save(err => {
	if(err) console.log('Counter of faqs is already exists');
});

exports.getAll = function (req, res) {
	Faq.find({}, (err, result) => {
		if(err) return res.json({response : 'Error'});
		return res.json(result);
	});
};

exports.get = function (req, res) {
	Faq.findById(Number(req.params.id), (err, result) => {
		if(err) return res.json({response : 'Error'});
		return res.json(result);
	});
};

exports.new = function (req, res) {
	Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
		if(err) return res.json({response : 'Error'});
		
		req.body._id = result.seq;
		var newfaq = new Faq(req.body);
		newfaq.save((err, result) => {
			if(err) return res.json({response : 'Error'});
			return res.json({response : 'Success', msg : 'Faq number ' + result._id + ' has been added'}); 
		});
	});
};

exports.delete = function (req, res) {
	Faq.findByIdAndRemove(Number(req.params.id), (err, result) => {
		if (err) return res.json({response : 'Error'});
		if(result == null) return res.json({response : 'Error', msg : 'Faq doesnt exist'}); 
		return res.json({response : 'Success', msg : 'Faq number ' + Number(result._id) + ' has been deleted'}); 
	});
};

exports.update = function (req, res) {
	req.body._id = Number(req.params.id);
	var updatefaq =  new Faq(req.body);
	Faq.findByIdAndUpdate(Number(req.params.id), { $set: updatefaq }, (err, result) => {
		if(err) return res.json({response : 'Error'});
		if(result == null) return res.json({response : 'Error', msg : 'Faq doesnt exist'}); 
		return res.json({response : 'Success', msg : 'Faq number ' + updatefaq._id + ' has been updated'}); 
	});
};