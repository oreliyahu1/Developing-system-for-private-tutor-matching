const nodemailer = require('nodemailer');
const ejs = require("ejs");
const projectConfigEmail = require('../config').email;

//define gmail login user and password to nodemailer
var transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
    port: 465,
    secure: true,
	auth: { user: projectConfigEmail.username, pass: projectConfigEmail.password }
});

//test mail sender
function sendMail(to, subject, mname, mtext){
	ejs.renderFile(__dirname + "/emailTemplate.ejs", { name: mname, message: mtext }, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var mailOptions = {
				to: to,
				subject: subject,
				html: data
			};
			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response + ' to ' + mailOptions.to);
				}
			});
			}
	});
}

module.exports = {sendMail};