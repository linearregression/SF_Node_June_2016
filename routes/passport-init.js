var mongoose = require('mongoose'); // mongoose
var db = require('../models/db'); // mongoose

// models
var People = require('../models/models-sfnode'); // mongoose

// Local Strategy
var LocalStrategy = require('passport-local').Strategy; // passport

// Google Strategy
var GoogleStrategy = require('passport-google-oauth20').Strategy; // passport

var http = require('http'); // passport

// password encryption 
var bCrypt = require('bcrypt'); // bcrypt
var saltRounds = 10; // bcrypt

// configuration file with secrets and client ID's
var config = require('../config-sfnode'); // passport

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) { // passport

        console.log('serializing user:', user.username); // DEBUG

        //return the unique id for the user
        done(null, user._id);
    });

    //Deserialize user will call with the unique id provided by serializeuser
    passport.deserializeUser(function (_id, done) { // passport

        People.findById(_id, function (err, user) {

            console.log('deserializing user: ', user.username); // DEBUG

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
                            console.log('Error saving user: ' + err); // DEBUG
                            throw err;
                        };

                         var Acl = require('acl'); // node_acl

                        var acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_', true)); // node_acl
                       
                       //node_acl
                        //Adds the given permissions to the given roles over the given resources.
                         acl.allow(newUser.username,newUser.username,'edit', function (err) {
                            if (err) { console.log('save error, ' + err); }

                            console.log('acl local \'profile\' allow edit created' + '\n'); // DEBUG

                        });

                        //Adds roles to a given user id.
                        // [NOTES] Roles - 'owner'
                        // [NOTES] User id -
                        // [NOTES] addUserRoles( userId, roles, function(err) )
                        acl.addUserRoles(newUser.username, newUser.username); //node_acl

                    });
                    return done(null, newUser);
                };
            });
        }));

    passport.use(new GoogleStrategy({ // passport
        clientID: config.google.GOOGLE_CLIENT_ID,
        clientSecret: config.google.GOOGLE_CLIENT_SECRET,
        callbackURL: config.google.GOOGLE_CALL_BACK_URL
    },
        function (accessToken, refreshToken, profile, cb) {

            console.log('profile = ' + JSON.stringify(profile)); // DEBUG

            People.findOne({ 'username': profile.displayName }, function (err, user) {

                // error check, return using the done method
                if (err) {

                    console.log('Error in sign up: ' + err); // [DEBUG]

                    return cb(err);
                };

                //already exist
                if (user) {
                    console.log('User already exist with username: ' + user.username + '\n'); // [DEBUG]

                    var upUser = new People(user);

                    upUser.googleId = profile.id;
                    upUser.username = user.username;
                    upUser.usrEmail = profile.emails[0].value;
                    upUser.usrPhotos = profile.photos[0].value;
                    upUser.usrOccupation = profile._json.occupation;
                    upUser.usrSkills = profile._json.skills;

                    for (var vUrls = 0; vUrls < profile._json.urls.length; vUrls++) {
                        upUser.usrUrls[vUrls] = profile._json.urls[vUrls].value;
                    };

                    upUser.usrHome = profile._json.url;
                    upUser.usrCover = profile._json.cover.coverPhoto.url;
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
                } else {// if there is no user, create the user
                    var newUser = new People();

                    //set the user's local credentials
                    newUser.googleId = profile.id;
                    newUser.username = profile.name.givenName + ' ' + profile.name.familyName;
                    //newUser.password = 'tre';
                    newUser.usrFirst = profile.name.familyName;
                    newUser.usrLast = profile.name.givenName;
                    newUser.usrEmail = profile.emails[0].value;
                    newUser.usrPhotos = profile.photos[0].value;
                    newUser.usrGender = profile.gender;
                    newUser.usrSocial = profile.provider;
                    newUser.usrOccupation = profile._json.occupation;
                    newUser.usrSkills = profile._json.skills;

                    for (var vUrls = 0; vUrls < profile._json.urls.length; vUrls++) {
                        newUser.usrUrls[vUrls] = profile._json.urls[vUrls].value;
                    };

                    newUser.usrHome = profile._json.url;
                    newUser.usrCover = profile._json.cover.coverPhoto.url;
                    newUser.usrAccessToken = accessToken; // [TO DO] - hash this data if possible, 11/14/2015
                    newUser.usrRefreshToken = refreshToken; // [TO DO] - hash this data if possible, 11/14/2015

                    // save the user
                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error saving user: ' + err);
                            throw err;
                        }
                        console.log(newUser.username + ' Registration successful' + '\n'); // [DEBUG]
                    });

                    newUser.save(function (err) {

                        if (err) {
                            console.log('Error saving user: ' + err);
                            throw err;
                        };

                        var Acl = require('acl'); // node_acl

                        var acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_', true)); // node_acl
                       
                       //node_acl
                        //Adds the given permissions to the given roles over the given resources.
                         acl.allow(newUser.username,newUser.username,'edit', function (err) {
                            if (err) { console.log('save error, ' + err); }

                            console.log('acl google \'profile\' allow edit created' + '\n'); // DEBUG

                        });

                        //Adds roles to a given user id.
                        // [NOTES] Roles - 'owner'
                        // [NOTES] User id -
                        // [NOTES] addUserRoles( userId, roles, function(err) )
                        acl.addUserRoles(newUser.username, newUser.username); //node_acl

                    });

                    return cb(null, user);
                }

            });

        }));

};