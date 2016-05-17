var express = require('express'); // express
var app_express = express(); // express

var models = require('./models/models-sfnode.js'); // mongoose
var mongoose = require('mongoose'); // mongoose

var meetupEvent = mongoose.model('meetupEvent'); // mongoose
var googleEvent = mongoose.model('googleEvent'); // mongoose

mongoose.connect('mongodb://localhost/sfnode2016'); // mongoose

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

app_express.get('/', function (req, res) {
    res.send(222); // [NOTE] show this response with Morgan logger, then change to ( res.send(222); )
}); // express

/*
// custom success function
app_express.post('/login',
    passport.authenticate('local'),
    function(req, res){
        // 'req.user' contains the authenticated user
        res.redirect('/users/' + req.user.username);
    }
); // passport

*/

// Local strategy
// built in definitions for success and failure action
app_express.post('login',
    passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true // flash an error message for the user
        }
    )
); // passport

/* NOTE - already moved to passport-init.js but commented output

passport.use(new MeetupStrategy({
    clientID: config.meetup.KEY,
    clientSecret: config.meetup.SECRET,
    callbackURL: 'http://localhost:3000/auth/meetup/callback'
}, function (accessToken, refreshToken, profile, done) {
    // store credentials, etc
})
); // passport

app_express.get('/auth/meetup', passport.authenticate('meetup')); // passport

app_express.get('/auth/meetup/callback',
    passport.authenticate('meetup',
        { failureRedirect: '/login' }),
    function (req, res) {
        // successful authentication, redirect home
        res.redirect('/');
    }); // passport
    */

var server = app_express.listen({
    host: 'localhost',
    port: 3000
}, function () {
    var vPort = server.address().port;
    var vHost = server.address().address;
    var vIp = server.address().family;

    console.log('listening on ' + vPort + ", as " + vIp + ", IP Address " + vHost);
}); // express