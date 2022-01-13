const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('./jwt');
const cors = require('cors');
const errorHandler = require('./errorHandler');

const projectConfig = require('./config');
const mongooseUrl = process.env.MONGODB_URI || projectConfig.db.url;
const port = process.env.PORT || projectConfig.port;
const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json());							// support json encoded bodies
app.use(cors());
app.use(jwt());
app.use(errorHandler);

const SyncRoute = require('./routes/sync.route');
const UserRoute = require('./routes/user.route');
const CourseRoute = require('./routes/course.route');
const CertificateRoute = require('./routes/certificate.route');
const FeedbackRoute = require('./routes/feedback.route');
const QuestionnaireRoute = require('./routes/questionnaire.route');
const MeetingRoute = require('./routes/meeting.route');
const FaqRoute = require('./routes/faq.route');

app.use('/api/sync', SyncRoute);
app.use('/api/users', UserRoute);
app.use('/api/courses', CourseRoute);
app.use('/api/certificates', CertificateRoute);
app.use('/api/feedbacks', FeedbackRoute);
app.use('/api/questionnaires', QuestionnaireRoute);
app.use('/api/meetings', MeetingRoute);
app.use('/api/faqs', FaqRoute);

let http = require('http');
let server = http.Server(app);

//init server => mongodb & port listen
mongoose.connect(mongooseUrl,  {dbName: projectConfig.db.name, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true}).then(() => {
	console.log("DB connected");
	server.listen(port, () => {
		console.log(`started on port: ${port}`);
	});
	console.log("Server is running, port:" + port);
 }
).catch(error  => { console.log("Cannot connect DB"); });

//block fav.ico
app.get('/favicon.ico', function(req, res) {
	res.end();
});

//video chat
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

peersByCode = [];
io.on('connection', (socket) => {
  console.log('user connected ' + socket.id);
  socket.on('message', data => {
  const code = data.roomid;
  if (!peersByCode[code]) {
    peersByCode[code] = [socket.id];
  } else if (!peersByCode[code].find(peer => peer === socket.id)) {
    if(peersByCode[code].length != 2){
      peersByCode[code].push(socket.id);
    } else {
      console.log("room is full!");
      return;
    }
  }
  console.log("Roomid: " + code + " " + peersByCode[code]);

  peersByCode[code]
  .filter(peer => peer != socket.id)
  .forEach(peer => io.to(peer).emit('message2', data));
  });
  
  socket.on('sendchat', data =>{
    const code = data.roomid;
    if (peersByCode[code]) {
      peersByCode[code].filter(peer => peer != socket.id)
      .forEach(peer => io.to(peer).emit('recievechat', data));
    }
  });

  socket.on('closeconnect', data => {
    const code = data.roomid;
		if (peersByCode[code]) {
      peersByCode[code] = peersByCode[code].filter(peer => peer != socket.id)
      console.log(peersByCode[code])
      console.log('user disconnected1');
      socket.disconnect();
    }
  });

  socket.on('disconnect', function() {
    peersByCode.forEach((element,index) => {
      for(var i=0; i < 2; i++) {
        if(element[i] == socket.id){
          peersByCode[index] =peersByCode[index].filter(peer => peer != socket.id)
          console.log("user " + socket.id + " disconnected from roomid: " + index);
        }
      }
    });
  });
});
