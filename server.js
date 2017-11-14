// Require Node Modules
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan'); 

// Requiring article model
var Article = require("./models/Article.js");
// Initialize Express for debugging & body parsing
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Serve Static Content
app.use(express.static(process.cwd() + '/public'));

// Mongoose DB Config
// Connect to localhost if not a production environment
if(process.env.NODE_ENV == 'production'){
  // Gotten using `heroku config | grep MONGODB_URI` command in Command Line
  mongoose.connect('mongodb://heroku_6s9v5szt:3vt64iqj81av9kf3d16cp13633@ds155695.mlab.com:55695/heroku_6s9v5szt');
}
else{
  mongoose.connect('mongodb://localhost/mongoHeadlines');
}
var db = mongoose.connection;

// Mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});


// Import Routes/Controller
var router = require('./controllers/controller.js');
app.use('/', router);


// Launch App
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});