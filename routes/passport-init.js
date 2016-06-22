var mongoose = require('mongoose'); // mongoose
var db = require('../models/db'); // mongoose
var moment = require('moment'); // Moment

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

                    var upUser = new People();

                    upUser.usrLastLogin = moment(); // Moment

                    upUser.save(function (err) {
                        if (err) {
                            throw err;
                        };
                        console.log('local usrLastLogin updated' + '\n'); // [DEBUG]
                    });

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
                        // [NOTES] allow( roles, resources, permissions, function(err) )
                        acl.allow([
                            {
                                roles: ['guest', 'guest', newUser.username]
                                , allows: [
                                    { resources: 'getUser', permissions: 'get' }
                                    , { resources: 'updateUser', permissions: 'get' }
                                    , { resources: newUser.username, permissions: 'edit' }
                                ]
                            }
                        ], function (err) {
                            if (err) { console.log('save error, ' + err); }

                            console.log('acl roles, permissions, and resources created in server.js' + '\n'); // DEBUG

                        });
                        /*
                        //node_acl
                        //Adds the given permissions to the given roles over the given resources.
                        // [NOTES] allow( roles, resources, permissions, function(err) )
                        acl.allow(newUser.username, newUser.username, 'edit', function (err) {
                                                    if (err) { console.log('save error, ' + err); }
                        
                                                    console.log('acl local \'profile\' allow edit created' + '\n'); // DEBUG
                        
                         });
                        */

                        //node_acl
                        //Adds roles to a given user id.
                        // [NOTES] addUserRoles( userId, roles, function(err) )
                        acl.addUserRoles(newUser.username, ['guest', newUser.username], function (err) {
                            if (err) { console.log('save error, ' + err); }

                            console.log('acl local \'profile\' addUser Roles' + '\n'); // DEBUG

                        });
                        console.log(newUser.username + ' Registration successful' + '\n'); // [DEBUG]
                    });
                    return done(null, newUser);
                };
            });
        }));

    // passport
    passport.use('google', new GoogleStrategy({ 
        clientID: config.google.GOOGLE_CLIENT_ID,
        clientSecret: config.google.GOOGLE_CLIENT_SECRET,
        callbackURL: config.google.GOOGLE_CALL_BACK_URL
    },
        function (accessToken, refreshToken, profile, cb) {
            People.findOne({ 'username': profile.displayName }, function (err, user) {
                if (err) { return cb(err) };

                if (user) {
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
                    upUser.usrLastLogin = moment(); // Moment

                    upUser.save(function (err) {
                        if (err) { throw err }
                    });

                    return cb(null, user);

                } else {
                    var newUser = new People();

                    newUser.googleId = profile.id;
                    newUser.username = profile.name.givenName + ' ' + profile.name.familyName;
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

                    newUser.save(function (err) {
                        if (err) {
                            console.log('Error saving user: ' + err);
                            throw err;
                        };

                        var Acl = require('acl'); // node_acl

                        var acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_', true)); // node_acl

                        //node_acl
                        //Adds the given permissions to the given roles over the given resources.
                        // [NOTES] allow( roles, resources, permissions, function(err) )
                        acl.allow([
                            {
                                roles: ['guest', 'guest', newUser.username]
                                , allows: [
                                    { resources: 'getUser', permissions: 'get' }
                                    , { resources: 'updateUser', permissions: 'get' }
                                    , { resources: newUser.username, permissions: 'edit' }
                                ]
                            }
                        ], function (err) {
                            if (err) { console.log('save error, ' + err); }

                            console.log('acl roles, permissions, and resources created in server.js' + '\n'); // DEBUG

                            console.log('before google return' + '\n'); // [DEBUG]

                        });

                        //node_acl
                        //Adds roles to a given user id.
                        // [NOTES] addUserRoles( userId, roles, function(err) )
                        acl.addUserRoles(newUser.username, ['guest', newUser.username], function (err) {
                            if (err) { console.log('save error, ' + err); }

                            console.log('acl google addUserRoles created' + '\n'); // DEBUG

                        });

                        console.log(newUser.username + ' Registration successful' + '\n'); // [DEBUG]
 
                });

                    console.log('after google oauth2callback return' + '\n'); // [DEBUG]
                    
                    return cb(null, newUser);
                };

            });

        }));

};