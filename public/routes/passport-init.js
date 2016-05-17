var mongoose = require('mongoose');

// models
//var User = mongoose.model('User'); // [NOTE] put in correct mongoose

// roles collection
// [NOTE] put in correct for mongoose
//var RoleUser = mongoose.model('gcAclUser');

// Local Strategy
var LocalStrategy = require('passport-local').Strategy; // passport

// Google Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; // passport

// Meetup Strategy
var MeetupStrategy = require('passport-meetup-oauth2').Strategy;

// password encryption 
// [NOTE] put in correct bcrypt code. This is from another module
// var bCrypt = require('bcrypt-nodejs');

// configuration file with secrets and client ID's
var config = require('./config-sfnode');

/*
finish this cut an paste from "passport-init" in GC2

module.exports = function(passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:', user.username);

        //return the unique id for the user
        return done(null, user._id);
    });

    //Deserialize user will call with the unique id provided by serializeuser
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {

            console.log('deserializing user: ', user.username);

            return done(err, user);
        });

    });

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
        //,usernameField: 'usrName', passwordField: 'usrPass' // add this when I am ready to change the 'models.js' names on this schema
    },
        function(req, username, password, done) {
...
            
        }
    ));

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function(req, username, password, done) {
            ...
            
passport.use(new GoogleStrategy({
        clientID: config.google.GOOGLE_CLIENT_ID,
        clientSecret: config.google.GOOGLE_CLIENT_SECRET,
        callbackURL: config.google.GOOGLE_CALL_BACK_URL
        //,passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function(accessToken, refreshToken, profile, done) {
...
*/
/*
[NOTE] - copied from server.js
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