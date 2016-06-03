var mongoose = require('mongoose'); // mongoose
var db = require('../models/db'); // mongoose

// models
var People = require('../models/models-sfnode'); // mongoose

// Local Strategy
var LocalStrategy = require('passport-local').Strategy; // passport

// Google Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy; // passport

// Meetup Strategy
//var MeetupStrategy = require('passport-meetup').Strategy; // passport // DEBUG
var MeetupStrategy = require('passport-meetup-oauth2').Strategy; // passport 

// password encryption 
var bCrypt = require('bcrypt'); // bcrypt
var saltRounds = 10; // bcrypt

// configuration file with secrets and client ID's
var config = require('../config-sfnode'); // passport

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) { // passport

        console.log('serializing user:', user.username);

        //return the unique id for the user
        done(null, user._id);
    });

    //Deserialize user will call with the unique id provided by serializeuser
    passport.deserializeUser(function (id, done) { // passport

        People.findById(id, function (err, user) {

            console.log('deserializing user: ', user.username);

            done(err, user);
        });

    });

    passport.use('login', new LocalStrategy({ // passport
        passReqToCallback: true
    },
        function (req, username, password, done) {

            People.findOne({ 'username': username }, function (err, user) {

                if (err) { return done(err); }

                if (!user) {
                    return done(null, false, { message: 'Incorrect username ' + username });
                }

                if (!bCrypt.compareSync(password, user.password)) { // bcrypt
                    return done(null, false, { message: 'Invalid Password for username ' + username });
                }

                return done(null, user);
            });
        }
    ));

    passport.use('signup', new LocalStrategy({ // passport
        passReqToCallback: true
    },
        function (req, username, password, done) {
            People.findOne({ 'username': username }, function (err, user) {

                if (err) {
                    //console.log('Error in sign up: ' + err); // [DEBUG]
                    return done(err);
                }
                if (user) {
                    //console.log('User already exist with username: ' + username); // [DEBUG]
                    return done(null, false);
                } else {
                    // if there is no user, create the user
                    var newUser = new People();

                    var salt = bCrypt.genSaltSync(saltRounds); //bcrypt
                    var hash = bCrypt.hashSync(password, salt); //bcrypt

                    //set the user's local credentials
                    newUser.username = username;
                    newUser.password = hash; // bcrypt
                    newUser.usrEmail = req.body.usrEmail;
                    newUser.usrFirst = req.body.usrFirst;
                    newUser.usrLast = req.body.usrLast;
                    newUser.usrSocial = 'local';

                    newUser.save(function (err) {

                        if (err) {
                            console.log('Error saving user: ' + err);
                            throw err;
                        };

                        var Acl = require('acl'); // node_acl

                        var acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_', true)); // node_acl

                        acl.allow(username, 'events', ['edit', 'view', 'delete'], function (err) {
                            if (err) { console.log('save error, ' + err); }
                            console.log('acl allowed'); // DEBUG
                        }); //node_acl

                        acl.addUserRoles(username, 'member'); //node_acl

                    });
                    return done(null, newUser);
                };
            });
        }));

    passport.use(new GoogleStrategy({ // passport
        clientID: config.google.GOOGLE_CLIENT_ID,
        clientSecret: config.google.GOOGLE_CLIENT_SECRET,
        callbackURL: config.google.GOOGLE_CALL_BACK_URL
        //,passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (accessToken, refreshToken, profile, cb) {

            console.log("google: " + profile); // [DEBUG]

            People.findOne({ 'googleId': profile.id }, function (err, user) {

                // error check, return using the done method
                if (err) {
                    console.log('Error in sign up: ' + err); // [DEBUG]
                    return cb(err);
                }
                //already exist
                if (user) {
                    console.log('User already exist with username: ' + user.username); // [DEBUG]

                    var upUser = new People(user);
                    upUser.usrAccessToken = accessToken;
                    upUser.usrRefreshToken = refreshToken;

                    upUser.save(function (err) {
                        if (err) {
                            console.log('Error saving user: ' + err);
                            throw err;
                        }
                        console.log('Tokens updated' + '\n');
                    });

                    return cb(err, user);
                } else {
                    // if there is no user, create the user
                    var newUser = new People();

                    //set the user's local credentials
                    newUser.username = profile.displayName;
                    //newUser.password = accessToken; //createHash(accessToken); [TO DO] - add password encryption when login works.
                    newUser.googleId = profile.id;
                    newUser.usrEmail = profile.emails[0].value;
                    newUser.usrFirst = profile.name.familyName;
                    newUser.usrLast = profile.name.givenName;
                    newUser.usrAccessToken = accessToken; // [TO DO] - hash this data if possible, 11/14/2015
                    newUser.usrRefreshToken = refreshToken; // [TO DO] - hash this data if possible, 11/14/2015
                    newUser.usrSocial = 'google';

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error saving user: ' + err);
                            throw err;
                        }
                        console.log(newUser.username + ' Registration successful');
                    });
                    return cb(null, user);
                }

                //return cb(err, user);
            });

            //return cb(null, profile);
        }));

    passport.use('meetup', new MeetupStrategy({ // passport
        clientID: config.meetup.MEETUP_KEY,
        clientSecret: config.meetup.MEETUP_SECRET,
        callbackURL: config.meetup.MEETUP_CALL_BACK_URL
    },
        function (accessToken, refreshToken, profile, done) {

            console.log('meetup profile = ' + JSON.stringify(profile));// [DEBUG]

            //find a user in mongo with this username
            People.findOne({ 'meetupId': profile.id }, function (err, user) {

                // error check, return using the done method
                if (err) {
                    console.log('Error in sign up: ' + err);
                    return done(err);
                }
                //already exist
                if (user) {
                    console.log('User already exist with username: ' + user.username);
                    var upUser = new People(user);
                    upUser.usrAccessToken = accessToken;
                    upUser.usrRefreshToken = refreshToken;
                    upUser.save(function (err) {
                        if (err) {
                            console.log('Error saving user: ' + err);
                            throw err;
                        }
                    });
                    return done(null, user); //works
                } else {
                    // if there is no user, create the user
                    var newUser = new People();

                    //newUser.username = profile.displayName;
                    //newUser.usrEmail = JSON.stringify(profile.emails); //can't get value with email, work on syntax 2015-10-10
                    //newUser.meetupId = profile.id;
                    newUser.usrAccessToken = accessToken; // [TO DO] - hash this data if possible,                    
                    newUser.usrRefreshToken = refreshToken; // [TO DO] - hash this data if possible,
                    newUser.usrSocial = 'meetup';

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error saving user: ' + err);
                            throw err;
                        }
                        console.log(newUser.username + ' Registration successful');
                        return done(null, newUser);
                    });
                }
            });

        }));
};