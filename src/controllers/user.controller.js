const jwt = require('jsonwebtoken');
const secret = require('../config').jwtSecret;

const emailHandler = require('../extends/email');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Certificate = require('../models/certificate.model');
const Counter = require('../models/counter.model');
const syncUserOff = require('./sync.controller').syncOff;
const syncUserOn = require('./sync.controller').syncOn;
const Questionnaire = require('../models/questionnaire.model');

const MIN_MATCHING_GRADE = 60;

//init employee schema => _id is increment key
var counter = new Counter({ _id: User.collection.collectionName });
counter.save(err => {
	if (err) console.log('Counter of users is already exists');
});

exports.new = function (req, res) {
	if (!checkEmailAndPassword(req.body.email, req.body.password)) return res.json({ response: 'Error', msg: 'Check your Mail and Password!' }); //check signup mail&password like client

	User.findOne({ email: req.body.email.toLowerCase() }, (err, result) => {
		if (err) return res.json({ response: 'Error' });
		if (result) return res.json({ response: 'Error', msg: 'User already exists in the system' });

		Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
			if (err) return res.json({ response: 'Error' });

			req.body._id = Number(result.seq);
			var newuser = new User(req.body);
			newuser.email = req.body.email.toLowerCase();
			newuser.save(err => {
				if (err) {
					if (err.code == 11000)
						return res.json({ response: 'Error', msg: 'User already exists in the system' });
					return res.json({ response: 'Error' + err })

				}

				var text = 'User: ' + req.body.email + '\nPassword: ' + req.body.password;
				emailHandler.sendMail(req.body.email, 'Thank you for registering', newuser.firstname, text); //send mail to user about successful registration
				return res.json({ response: 'Success', msg: 'Successfully registered ' + req.body.email });
			});
		});
	});
};

exports.forgotpassword = function (req, res) {
	if (req.body.email == null) return res.json({ response: 'Error' });

	User.findOne({ email: req.body.email.toLowerCase() }, (err, result) => {
		if (err) return res.json({ response: 'Error' });
		if (result == null) return res.json({ response: 'Error', msg: 'User ' + req.body.email + ' doesnt in the system' });

		var text = 'User: ' + result.email + '\nPassword: ' + result.password;
		emailHandler.sendMail(req.body.email, 'Reset Password', result.firstname, text); //send mail with the password
		return res.json({ response: 'Success', msg: 'Password sent to email ' + req.body.email });
	});
};

exports.login = function (req, res) {
	if (req.body.email == null) return res.json({ response: 'Error' });

	User.findOne({ email: req.body.email.toLowerCase() }, (err, result) => {
		if (err) return res.json({ response: 'Error' });
		if ((result == null) || (result.password != req.body.password)) return res.json({ response: 'Error', msg: 'Incorrect username or password' });
		result = result.toJSON();
		const token = jwt.sign({ id: result._id }, secret);
		delete result.password;
		result.token = token;

		async function addKnowledge(result) {
			const courses = await Course.find({ _id: { $in: result.courses } });
			const certificates = await Certificate.find({ _id: { $in: result.courses } });
			result.courses = courses;
			result.certificates = certificates;
			return res.json({ response: 'Success', msg: 'Login successful', data: result });
		}

		syncUserOff(result._id);
		addKnowledge(result)
	});
};

//calculate matching grade between user1 and user2 
//option1: user1:student user2:tutor
//option2: user1:tutor   user2:student
exports.calcMatchingGrade = function (req, res) {
	let user1 = req.params.s_id;
	let user2 = req.params.t_id;
	if (user1 == undefined || user2 == undefined) return res.json({ response: "Error" });

	User.findById(Number(user1), (err, user1) => {
		if (err || user1 == null) return res.json({ response: "Error" });
		var ans = user1.answers_vector.ans;

		Questionnaire.findById(Number(user1.answers_vector.q_id), (err, questionare) => {
			if (err) return res.json({ response: "Error" });
			var percent = [];
			for (var i = 0; i < questionare.questions.length; i++) {
				percent.push(ans[i] / questionare.questions[i].grade_rate);
			}

			User.findById(Number(user2), (err, user2) => {
				if (err || user2 == null) return res.json({ response: "Error" });
				if (user1.answers_vector.q_id != user2.weights_vector.q_id ||
					user2.answers_vector.q_id != user1.weights_vector.q_id) return res.json({ response: "Error" });

				var wghts = user2.weights_vector.wght;
				var grade = 0;
				for (var j = 0; j < wghts.length; j++) {
					grade += wghts[j] * percent[j];
				}
				user2.matchingGrade = grade;

				return res.json(user2);
			});
		});
	});
};

exports.get = function (req, res) {
	User.findById(Number(req.params.id), (err, result) => {
		if (err || result == null) return res.json({ response: 'Error' });
		result = result.toJSON();
		delete result.password;

		async function addKnowledge(result) {
			const courses = await Course.find({ _id: { $in: result.courses } });
			const certificates = await Certificate.find({ _id: { $in: result.courses } });
			result.courses = courses;
			result.certificates = certificates;
			return res.json(result);
		}

		addKnowledge(result)
	});
};

exports.getAll = function (req, res) {
	User.find({}, (err, result) => {
		if (err) return res.json({ response: 'Error' });
		return res.json(result);
	});
};

exports.getSuitableTutors = function (req, res) {
	let courseName = req.params.course;
	let user = req.params.id;
	if (user == undefined || courseName == undefined) return res.json({ response: "Error" });

	Course.findOne({ name: courseName }, (err, course) => {
		if (err || course == null) return res.json({ response: "Error" });
		var courseid = course._id;

		User.findById(Number(user), (err, user) => {
			if (err || user == null) return res.json({ response: "Error" });

			Questionnaire.findById(user.answers_vector.q_id, (err, quesStudent)=> {
				if (err || quesStudent == null) return res.json({ response: "Error" });
				
				User.find({ type: 'Tutor', courses: {$in: [courseid]}}, (err, users) => {
					if (err || users == null) return res.json({ response: "Error" });

					var percent = [];
					for (var i = 0; i < quesStudent.questions.length; i++) {
						percent.push(user.answers_vector.ans[i] / quesStudent.questions[i].grade_rate);
					}
					console.log(percent);
					var grade;
					var items_tosend = [];
					for (var i = 0; i < users.length; i++) {
						if (users[i].weights_vector.q_id != user.answers_vector.q_id || users[i].answers_vector.q_id != user.weights_vector.q_id) {
							continue;
						}

						console.log(users[i].weights_vector.wght);
						grade = 0;
						for (var j = 0; j < users[i].weights_vector.wght.length; j++) {
							grade += users[i].weights_vector.wght[j] * percent[j];
						}
						//grade = parseInt(grade);
						console.log(grade);
						users[i].matchingGrade = grade;

						if (grade >= MIN_MATCHING_GRADE) {
							items_tosend.push(users[i]);
						}
					}
					
					items_tosend = items_tosend.sort(function(a, b) {
						var x = b.matchingGrade; var y = a.matchingGrade;
						return ((x < y) ? -1 : ((x > y) ? 1 : 0));
					});
					return res.json(items_tosend);
				});
			});
		});
	});
};

exports.logout = function (req, res) {
	res.json({ response: 'Success', msg: 'Logout successful' });
};

exports.update = function (req, res) {
	req.body._id = Number(req.params.id);
	var updateuser = new User(req.body);
	User.findByIdAndUpdate(Number(req.params.id), { $set: updateuser }, (err, result) => {
		if (err || result == null) return res.json({ response: 'Error' });
		syncUserOn(req.body._id);
		return res.json({ response: 'Success', msg: 'User number ' + updateuser._id + ' has been updated' });
	});
}

//check mail and password
function checkEmailAndPassword(email, pass) {
	if (email == null || pass == null) return false;
	if (!email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/))
		return false;
	if (pass.length < 6) {
		return false;
	} else if (!pass.match(/^(?=.*[A-Z])/)) {
		return false;
	} else if (!pass.match(/^(?=.*[a-z])/)) {
		return false;
	} else if (!pass.match(/^(?=.*\d)/)) {
		return false;
	} else if (!pass.match(/^(?=.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#])/)) {
		return false;
	}
	return true;
}