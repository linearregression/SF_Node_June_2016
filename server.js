var express = require('express'); // express
var app_express = express(); // express

app_express.use(express.static('public')); // express
/*
// safer way to use express on a host
app_express.use(express.static(__direname + 'public')); // express 
*/

var models = require('./models/models-sfnode.js'); // mongoose
var mongoose = require('mongoose'); // mongoose

var meetupEvent = mongoose.model('meetupEvent'); // mongoose
var googleEvent = mongoose.model('googleEvent'); // mongoose

mongoose.connect('mongodb://localhost/sfnode2016:3000'); // mongoose

// [NOTE] use fs for writing logs to file
// var fs = require('fs'); // morgan
var logger = require('morgan'); // morgan

// [NOTE] logging format that works well for development
app_express.use(logger('dev'));  // morgan

/*
// [NOTE] Standard log output
app_express.use('common');  // morgan
// [NOTE] Minimal output
app_express.use('tiny');  // morgan

// [NOTE] Write logs to file
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'}); // morgan
app_express.use(morgan('common', {stream: accessLogStream})); // morgan
*/

var passport = require('passport'); // passport

// Initialize Passport
var initPassport = require('./routes/passport-init'); // passport
initPassport(passport); // passport

//var auth = require('./routes/authenticate')(passport); // passport // below is an alternate way of doing it that matches initPassport
var auth = require('./routes/authenticate'); // passport
auth(passport); //passport


//[NOTE] show this response with Morgan logger, then REMOVE
//app_express.get('/', function (req, res) {res.sendStatus(222)}); // express

var server = app_express.listen({
    host: 'localhost',
    port: 3000
}, function () {
    var vPort = server.address().port;
    var vHost = server.address().address;
    var vIp = server.address().family;

    console.log('listening on ' + vPort + ", as " + vIp + ", IP Address " + vHost);
}); // express