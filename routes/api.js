var express = require('express');//express
var router = express.Router();//express

var mongoose = require('mongoose'); // mongoose
var db = require('../models/db'); // mongoose
var People = mongoose.model('People'); // mongoose

var http = require('http');
var https = require('https');
var config = require('../config-sfnode');//passport

var isAuthenticated = function (req, res, next) { // passport

  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};

var google_access_token = '';

/*
//router.use('/muEvents', isAuthenticated); // passport

//var Acl = require('acl'); // node_acl

//var acl = new Acl(new Acl.mongodbBackend(mongoose.createConnection('mongodb://localhost/sfnode2016'), 'acl_', true)); // node_acl and a multiple connection to mongodb

// guest is allowed to view blogs 
//acl.allow('member', 'events', 'view', function (err) { }); // node_acl

// allow function accepts arrays as any parameter
//acl.allow('admin', 'events', ['*']); // node_acl

//check if a user has permissions to access a given resource
acl.isAllowed('username', 'events', 'view', function (err, res) { // node_acl
  if (res) {
    console.log('username is allowed to view events!');
  }
});
*/

// Get Google Calendar events
router.route('/getCalendar')
  .get(function (req, res) {
    /*
    Request must include authorization token
    
    Request must include access token
    
    request event ( GET https://www.googleapis.com/calendar/v3/calendars/calendarId/events/eventId )
    - details ( https://developers.google.com/google-apps/calendar/v3/reference/events/get#http-request )
    
    request list ( GET https://www.googleapis.com/calendar/v3/calendars/calendarId/events )
    - details ( https://developers.google.com/google-apps/calendar/v3/reference/events/list )
    
    q = meetup
    timeMax = datetime, Upper bound (exclusive) for an event's start time to filter by
    timeMin = datetime, Lower bound (inclusive) for an event's end time to filter by
    
    */
    var vParsed = '';

    function fAccessToken() {

      console.log('req.username ' + req.params.username); // DEBUG

      //People.findOne({ 'username': req.username }, function (err, user) {
      People.findOne({ 'username': 'Tre\' Grisby' }, function (err, user) {
        var google_access_token = '';

        google_access_token = user.usrAccessToken;

        console.log('google_access_token ' + google_access_token); // DEBUG

        return (google_access_token);
      });

    };

    var getCalendar_options = {
      host: 'www.googleapis.com'
      //, path: '/calendar/v3/calendars/primary/events?q=meetup&key={'+ config.google.GOOGLE_API_KEY + '}'
      , path: '/calendar/v3/calendars/primary/events?q=meetup&access_token=' + fAccessToken()
    };

    var getCalendar_callback = function (response) {
      response.on('data', function (chunk) {
        vParsed += chunk;
      });
      response.on('end', function () {
        return res.send(vParsed);
      });
    };
    https.request(getCalendar_options, getCalendar_callback).end();

  })
  ;

// Meetup API - get events that user has RSVP'd for
router.route('/muEvents')
  .get(function (req, res) {

    var vParsed = '';

    function fAccessToken() {

      console.log('req.username ' + req.params.username); // DEBUG

      //People.findOne({ 'username': req.username }, function (err, user) { // DEBUG
      People.findOne({ 'username': 'Tre\' G. III' }, function (err, user) { // DEBUG
        var meetup_access_token = '';
        meetup_access_token = user.usrToken;
        
        console.log('meetup_access_token ' + meetup_access_token); // DEBUG

        return (meetup_access_token);
      });

    };

    /*
    API Request Signing
    - oauth_timestamp
    Include a timestamp (oauth_timestamp) which must match to within a 5 minute window of the server time, expressed in the number of seconds since January 1, 1970 00:00:00 GMT.
    
    - oauth_nonce
    Include a nonce (oauth_nonce) which is a unique, randomly generated number that is specific to this request.
    
    - oauth_consumer_key
    Include the consumer key (oauth_consumer_key) which is used to identify the application making the request.
    
    - oauth_signature_method
    Include the signature method (oauth_signature_method) and signature (oauth_signature) which are cryptographically generated digests of the resource URL, the parameters, the consumer secret, and the nonce + timestamp values.
    */
    
    var muEvents_options = {
      host: 'api.meetup.com'
      , path: '/self/events?page=10&sig_id=4038172&only=group.name%2Ctime%2Cutc_offset'
      //, path: '/self/events?page=10&only=group.name%2Ctime%2Cutc_offset&sign=true&key=' + config.meetup.MEETUP_KEY
      //, path: '/self/events?page=10&only=group.name%2Ctime%2Cutc_offset&sign=true&access_token=' +fAccessToken()
      //, path: '/self/events?access_token=#&only=group.name%2Ctime%2Cutc_offset'
      //, path: '/self/events?page=10&sig_id=4038172&only=group.name%2Ctime%2Cutc_offset&key=#'//config.meetup.API_Key

      /*
      http://api.meetup.com/self/events?page=10&sig_id=4038172&only=group.name%2Ctime%2Cutc_offset&key=#
      */
    };

    var muEvents_callback = function (response) {

      response.on('data', function (chunk) {
        vParsed += chunk;
      });

      response.on('end', function () {

        console.log('vParsed end() = ' + vParsed);
        return res.send(vParsed);

      });
    };

    http.request(muEvents_options, muEvents_callback).end();

  });

module.exports = router;