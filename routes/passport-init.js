var mongoose = require('mongoose'); // mongoose

// models
var People = mongoose.model('people'); // mongoose

// roles collection
// [NOTE] put in correct for mongoose
//var RoleUser = mongoose.model('gcAclUser');

// Local Strategy
var LocalStrategy = require('passport-local').Strategy; // passport

// Google Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; // passport

// Meetup Strategy
var MeetupStrategy = require('passport-meetup-oauth2').Strategy; // passport

// password encryption 
// [NOTE] put in correct bcrypt code. This is from another module
// var bCrypt = require('bcrypt-nodejs');

// configuration file with secrets and client ID's
var config = require('./config-sfnode');

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user:', user.username);

        //return the unique id for the user
        return done(null, user._id);
    });

    //Deserialize user will call with the unique id provided by serializeuser
    passport.deserializeUser(function (id, done) {
        People.findById(id, function (err, user) {

            console.log('deserializing user: ', user.username);

            return done(err, user);
        });

    });

    passport.use('login', new LocalStrategy({
        passReqToCallback: true
        //,usernameField: 'usrName', passwordField: 'usrPass' // add this when I am ready to change the 'models.js' names on this schema
    },
        function (req, username, password, done) {

            People.findOne({ 'username': username }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    console.log('User Not Found with username ' + username);
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    console.log('Invalid Password for username ' + username);
                    //wrong password
                    return done(null, false); // redirect back to login page
                }

                // save date user logged in
                user.usrLoginDate = Date.now();
                user.save();

                // User and password both match, return user from done method
                // which will be treated like success
                return done(null, user);
            })

        }
    ));

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, username, password, done) {

            console.log('newUser req.body' + JSON.stringify(req.body)); // [DEBUG]

            People.findOne({ 'username': username }, function (err, user) {

                if (err) {
                    console.log('Error in sign up: ' + err); // [DEBUG]
                    return done(err);
                }
                //already exist
                if (user) {
                    console.log('User already exist with username: ' + username); // [DEBUG]
                    return done(null, false);
                } else {

                    // if there is no user, create the user
                    var newUser = new User();

                    //set the user's local credentials
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.usrEmail = req.body.usrEmail;
                    newUser.usrFirst = req.body.usrFirst;
                    newUser.usrLast = req.body.usrLast;

                    // save the user
                    newUser.save(function (err) {

                        if (err) {
                            console.log('Error saving user: ' + err);
                            throw err;
                        }
                    });

                    return done(null, newUser);
                };
            });
        }));

    // Google Login

    //passport.use('google', new GoogleStrategy({
    passport.use(new GoogleStrategy({
        clientID: config.google.GOOGLE_CLIENT_ID,
        clientSecret: config.google.GOOGLE_CLIENT_SECRET,
        callbackURL: config.google.GOOGLE_CALL_BACK_URL
        //,passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (accessToken, refreshToken, profile, done) {

            console.log(profile);// [DEBUG]

            //find a user in mongoDB with this username
            User.findOne({ 'username': profile.displayName }, function (err, user) {

                // error check, return using the done method
                if (err) {
                    console.log('Error in sign up: ' + err);
                    return done(err);
                }
                //already exist
                if (user) {
                    console.log('User already exist with username: ' + user.username);

                    return done(null, user); //works
                } else {
                    // if there is no user, create the user
                    var newUser = new User();

                    //set the user's local credentials
                    newUser.username = profile.displayName;
                    newUser.password = createHash(accessToken);
                    newUser.usrEmail = JSON.stringify(profile.emails); //can't get value with email, work on syntax 2015-10-10
                    newUser.usrFirst = profile.name.familyName;
                    newUser.usrLast = profile.name.givenName;
                    newUser.usrAccessToken = accessToken; // [TO DO] - hash this data if possible, 11/14/2015
                    newUser.usrRefreshToken = refreshToken; // [TO DO] - hash this data if possible, 11/14/2015

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
                // User and password both match, return user from done method
                // which will be treated like success
                return done(null, user);
            });

        }));

    // meetup.com login
    /*
    meetup.com api reference - http://www.meetup.com/meetup_api/
    
    Passport module & integration - https://github.com/joewoodhouse/passport-meetup-oauth2
    */
    // Meetup configuration
    var MEETUP_APP_ID = '13m7875vnsacf3tob08i12a9i7';
    var MEETUP_APP_SECRET = 'fljkqcdi4snvf9khtpt3k5il8s';
    var MEETUP_CALLBACK_URL = 'https://localhost:3000/auth/meetup/callback';

    passport.use(new MeetupStrategy({
        clientID: MEETUP_APP_ID,
        clientSecret: MEETUP_APP_SECRET,
        callbackURL: MEETUP_CALLBACK_URL
    },
        function (accessToken, refreshToken, profile, done) {

            // rference - 
            console.log(profile);// [DEBUG]

            //find a user in mongo with this username
            People.findOne({ 'username': profile.displayName }, function (err, user) {

                // error check, return using the done method
                if (err) {
                    console.log('Error in sign up: ' + err);
                    return done(err);
                }
                //already exist
                if (user) {
                    console.log('User already exist with username: ' + user.username);
                    //return done(null, false); // causes error
                    return done(null, user); //works
                } else {
                    // if there is no user, create the user
                    var newUser = new User();

                    //set the user's local credentials
                    newUser.username = profile.displayName;
                    newUser.usrEmail = JSON.stringify(profile.emails); //can't get value with email, work on syntax 2015-10-10
                    newUser.usrFirst = profile.name.familyName;
                    newUser.usrLast = profile.name.givenName;
                    newUser.usrAccessToken = accessToken; // [TO DO] - hash this data if possible, 11/14/2015
                    newUser.usrRefreshToken = refreshToken; // [TO DO] - hash this data if possible, 11/14/2015

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