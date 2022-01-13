const Feedback = require('../models/feedback.model');
const Counter = require('../models/counter.model');
const Meeting = require('../models/meeting.model');
const Questionnaire = require('../models/questionnaire.model');
const User = require('../models/user.model');
const syncUserOn = require('./sync.controller').syncOn;
var qp = require('../QP_algorithm/quadprog');

const MIN_MATCHING_GRADE = 60;

//init feedback schema => _id is increment key
var counter = new Counter({ _id: Feedback.collection.collectionName });
counter.save(err => {
	if (err) console.log('Counter of feedback is already exists');
});

exports.getAll = function (req, res) {
	Feedback.find({}, (err, result) => {
		if (err) return res.json({ response: 'Error' });
		return res.json(result);
	});
};

exports.get = function (req, res) {
	Feedback.findById(Number(req.params.id), (err, result) => {
		if (err) return res.json({ response: 'Error' });
		return res.json(result);
	});
};

exports.new = function (req, res) {
	Counter.findByIdAndUpdate(counter, { $inc: { seq: 1 } }, { new: true }, (err, result) => {
		if (err) return res.json({ response: 'Error' });

		req.body._id = result.seq;

		async function copy_details(result) {
			//check first if the feedback is given!
			const feedb = await Feedback.findOne({ meeting: result.meeting, from_user: result.from_user });
			if (feedb != null) return res.json({ response: "Error", msg: "You have already give a feedback on that user!" })

			//get current weights and ans of from_user
			const from_user = await User.findById(result.from_user);
			result.from_user_current_answers_vector = from_user.answers_vector;
			result.from_user_current_weights_vector = from_user.weights_vector;
			//get current weights and ans of to_user
			const to_user = await User.findById(result.to_user);
			result.to_user_current_answers_vector = to_user.answers_vector;
			result.to_user_current_weights_vector = to_user.weights_vector;

			//get meeting
			const meeting = await Meeting.findById(result.meeting);
			if (meeting.status == "Approved") {
				meeting.status = (meeting.student == from_user._id) ? "WaitingForFeedback01" : "WaitingForFeedback10";
			} else if (meeting.status == "WaitingForFeedback01") { //student gave feedback
				if (meeting.tutor == from_user._id)
					meeting.status = "Completed";
				else
					return res.json({ response: 'Error' });
			} else if (meeting.status == "WaitingForFeedback10") { //Tutor gave feedback
				if (meeting.student == from_user._id)
					meeting.status = "Completed";
				else
					return res.json({ response: 'Error' });
			} else {
				return res.json({ response: "Error", msg: "Not Approved Meeting" })
			}
			//update meeting
			var updatemeeting = new Meeting(meeting);
			Meeting.findByIdAndUpdate(Number(meeting._id), { $set: updatemeeting }, (err, result2) => {
				if (err || result2 == null) return res.json({ response: 'Error' });
			});
			console.log(meeting);

			//
			var newfeedback = new Feedback(req.body);
			newfeedback.calculated = false;
			newfeedback.cross_calculated = false;
			await newfeedback.save();

			//if (!newfeedback.good) {
			const feedbacks_questionnaire = await Questionnaire.findById(from_user.weights_vector.q_id);
			if (newfeedback.to_user_current_answers_vector.q_id == feedbacks_questionnaire._id) {
				console.log("calc old matching grade");
				console.log(from_user.weights_vector);
				console.log(to_user.answers_vector);
				var old_matchingGrade = 0;
				for (let i = 0; i < from_user.weights_vector.wght.length; i++) {
					old_matchingGrade += from_user.weights_vector.wght[i] * (to_user.answers_vector.ans[i] / feedbacks_questionnaire.questions[i].grade_rate);
				}
				console.log("old mg " + old_matchingGrade);

				var feedback_matchingGrade = 0;
				for (let i = 0; i < from_user.weights_vector.wght.length; i++) {
					feedback_matchingGrade += from_user.weights_vector.wght[i] * (newfeedback.from_user_feedback_answers_vector.ans[i] / feedbacks_questionnaire.questions[i].grade_rate);
				}
				console.log("fb mg " + feedback_matchingGrade);
	
				const from_user_all_feedbacks = await Feedback.find({from_user: from_user._id});
				const from_user_feedbacks_count = from_user_all_feedbacks.length + 1;
				var new_mg_to_add = (feedback_matchingGrade - old_matchingGrade) / from_user_feedbacks_count;
				var new_matchingGrade = old_matchingGrade + new_mg_to_add;
			}
			else {
				console.log("newfeedback.to_user_current_answers_vector.q_id != feedbacks_questionnaire._id!!!")
				var new_mg_to_add = newfeedback.good ? 1 : -1;
				var new_matchingGrade = MIN_MATCHING_GRADE;
			}

			console.log("new_mg_to_add " + new_mg_to_add);
			console.log("new mg " + new_matchingGrade);

			console.log("qp");
			const feedback_to_calcuate = await Feedback.find({calculated: false, from_user: from_user._id});
			var calcuated_ids = [], positive_vec = [], negative_vec = [];

			for(feedback of feedback_to_calcuate) {
				if (feedback.to_user_current_answers_vector.q_id != feedbacks_questionnaire._id) {
					continue;
				}

				var normal_fb_vec = [];
				for (var i = 0; i < feedbacks_questionnaire.questions.length; i++) {
					normal_fb_vec.push(feedback.to_user_current_answers_vector.ans[i] / feedbacks_questionnaire.questions[i].grade_rate);
				}

				//if (feedback.good) {
				if (new_mg_to_add > 0) {
					positive_vec.push(normal_fb_vec);
				} else {
					negative_vec.push(normal_fb_vec);
				}

				calcuated_ids.push(feedback._id);
			}

			await Feedback.updateMany({ _id: { $in: calcuated_ids } }, { $set: { calculated: true } }, { multi: true });

			if (new_mg_to_add != 0 && calcuated_ids.length) {
				console.log(positive_vec);
				console.log(negative_vec);

				qp_res = calcQP(positive_vec, negative_vec, from_user.weights_vector.wght, new_matchingGrade);

				if (qp_res) {
					var qp_res_sum = 0;
					for (var i = 0; i < qp_res.length; i++) {
						qp_res_sum += qp_res[i];
					}
					const qp_res_ratio = 100 / qp_res_sum;
					for (var i = 0; i < qp_res.length; i++) {
						qp_res[i] *= qp_res_ratio;
					}

					console.log("qp res " + qp_res);
					from_user.weights_vector.wght = qp_res;
					await User.findByIdAndUpdate(from_user._id, from_user);
					syncUserOn(from_user._id);
				}
			}
			
			////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//cross_validation
			console.log("qp_cross_validation");
			console.log("new_mg_to_add " + new_mg_to_add);
			console.log("new mg " + new_matchingGrade);	
			const cross_feedbacks_questionnaire = await Questionnaire.findById(to_user.answers_vector.q_id);
			const cross_feedback_to_calcuate = await Feedback.find({cross_calculated: false, to_user: to_user._id});
			var calcuated_ids = [], positive_vec = [], negative_vec = [];

			for(feedback of cross_feedback_to_calcuate) {
				if (feedback.from_user_current_weights_vector.q_id != cross_feedbacks_questionnaire._id) {
					continue;
				}

				//if (feedback.good) {
				if (new_mg_to_add > 0) {
					positive_vec.push(feedback.from_user_current_weights_vector.wght);
				} else {
					negative_vec.push(feedback.from_user_current_weights_vector.wght);
				}

				calcuated_ids.push(feedback._id);
			}

			await Feedback.updateMany({ _id: { $in: calcuated_ids } }, { $set: { cross_calculated: true } }, { multi: true });

			if (new_mg_to_add != 0 && calcuated_ids.length) {
				console.log(positive_vec);
				console.log(negative_vec);

				var normal_ans_vec = [];
				for (var i = 0; i < cross_feedbacks_questionnaire.questions.length; i++) {
					normal_ans_vec.push(to_user.answers_vector.ans[i] / cross_feedbacks_questionnaire.questions[i].grade_rate);
				}

				qp_res = calcQP(positive_vec, negative_vec, normal_ans_vec, new_matchingGrade);

				if (qp_res) {
					var ans_vec = [];
					for (var i = 0; i < feedbacks_questionnaire.questions.length; i++) {
						ans_vec.push((qp_res[i] > 1 ? 1 : qp_res[i]) * feedbacks_questionnaire.questions[i].grade_rate);
					}

					console.log(ans_vec);
					to_user.answers_vector.ans = ans_vec;
					await User.findByIdAndUpdate(to_user._id, to_user);
					syncUserOn(to_user._id);
				}
			}

			return res.json({ response: 'Success', msg: 'Feedback number ' + result._id + ' has been added' });
		}
		copy_details(req.body)
	});
};

exports.delete = function (req, res) {
	Feedback.findByIdAndRemove(Number(req.params.id), (err, result) => {
		if (err) return res.json({ response: 'Error' });
		if (result == null) return res.json({ response: 'Error', msg: 'Feedback doesnt exist' });
		return res.json({ response: 'Success', msg: 'Feedback number ' + Number(result._id) + ' has been deleted' });
	});
};

exports.update = function (req, res) {
	req.body._id = Number(req.params.id);
	var updatefeedback = new Feedback(req.body);
	Feedback.findByIdAndUpdate(Number(req.params.id), { $set: updatefeedback }, (err, result) => {
		if (err) return res.json({ response: 'Error' });
		if (result == null) return res.json({ response: 'Error', msg: 'Feedback doesnt exist' });
		return res.json({ response: 'Success', msg: 'Feedback number ' + updatefeedback._id + ' has been updated' });
	});
};


function calcQP(postive_vec, negative_vec, to_minimize_vec, P)
{
	const epsilon = 0.000001;
	var Qmat = [], d_vec = [], Amat = [], b_vec = [];

	//calculate with saved data and body
	//build the minimize function
	for(let i = 1; i <= to_minimize_vec.length; i++){
		d_vec[i] = to_minimize_vec[i-1];  //f(x,m) = (x1 - m1)^2 + (x2-m2)^2 +..+ (xn-mn)^2 needs to be minimized
	}

	for(let i = 1; i <= to_minimize_vec.length; i++){
		Qmat[i] = [];
		for(let j=1; j <= to_minimize_vec.length; j++){
			Qmat[i][j] = (i==j) ? 1 : 0;
		}
	}

	//build the constraints
	for(let i=1; i <= to_minimize_vec.length; i++){
		Amat[i] = [];
		for(var j=1; j <= to_minimize_vec.length; j++){
			Amat[i][j] = (i==j) ? 1 : 0;
		}

		for(let w=0; w < postive_vec.length; w++){
			Amat[i][j++] = postive_vec[w][i-1];
		}

		for(let w=0; w < postive_vec.length; w++){
			Amat[i][j++] = -postive_vec[w][i-1];
		}

		for(let w=0; w < negative_vec.length; w++){
			Amat[i][j++] = -negative_vec[w][i-1];
		}
	}

	//build b_vec
	for(var i=1; i <= to_minimize_vec.length; i++){
		b_vec[i] = 0 + epsilon;
	}
	
	for(let j=0; j <postive_vec.length; j++){
		b_vec[i++] = P + epsilon;
	}

	for(let j=0; j <postive_vec.length; j++){
		b_vec[i++] = -100;
	}

	for(let j=0; j <negative_vec.length; j++){
		b_vec[i++] = -(P - epsilon);
	}

	/*
	console.log("calcQP");
	console.log(b_vec);
	console.log(d_vec);
	console.log(Amat);
	console.log(Qmat);
	*/
	res = qp.solveQP(Qmat, d_vec, Amat, b_vec);
	//console.log(res);
	return res.message ? null : res.solution.slice(1);
}