var express = require('express'); // express
var router = express.Router(); // express

var mongoose = require('mongoose'); // mongoose
var db = require('../models/db'); // mongoose
var People = mongoose.model('People'); // mongoose

var http = require('http');
var https = require('https');
var config = require('../config-sfnode'); // passport

//var moment = require('moment'); // Moment
var moment = require('moment-timezone'); // Moment

// passport
var isAuthenticated = function (req, res, next) { 

  console.log('api req.isAuthenticated() = ' + req.isAuthenticated()); // DEBUG
  
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};

router.use('/getUser', isAuthenticated); // passport
router.use('/updateUser/:id', isAuthenticated); // passport

//router.use('/getUser', acl.middleware()); // node_acl

var Acl = require('acl'); // node_acl

var acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_', true)); // node_acl

router.route('/getUser')
  .get(function (req, res) {

    /*
        acl.middleware(1, req.query.username, 'guest', function (err, res) {
          
          console.log('begin acl.middleware'); // DEBUG
     
          if (res) {
     
            console.log('getUser allowed'); // DEBUG
     
            //return next();
             People.find({ "username": req.query.username }, function (err, mongoUser) {
          return res.send(mongoUser);
        });
          } else {
     
            console.log('getUser not allowed'); // DEBUG
     
            return res.end();
          }
        });
    */

    console.log('getUser begins'); // debug

    console.log('getUser req.query.username ' + req.query.username); // debug


    //userRoles( userId, function(err, roles) )
    acl.userRoles(req.query.username, function (err, roles) {
      console.log('roles = ' + roles);
    });

    //isAllowed( userId, resource, permissions, function(err, allowed) )
    acl.isAllowed(req.query.username, req.query.username, 'edit', function (err, allowed) {

      console.log('acl.isAllowed begins, allowed = ' + allowed); // debug

      if (err) {
        return res.send(500, err);
      };

      if (!allowed) {
        return res.sendStatus(401);
      };

      People.find({ "username": req.query.username }, function (err, mongoUser) {

        var newUser = JSON.parse(JSON.stringify(mongoUser));

        newUser[0].timeFrom = moment().from(mongoUser.usrLastLogin); // Moment
        newUser[0].timeTo = moment().to('2016-12-31'); // Moment

        //newUser[0].tzOffset1 = moment().tz("2016-12-18T20:00:00", "America/New_York"); // Moment
        newUser[0].tzOffset1 = moment().tz("America/New_York").format('MMMM d, YYYY H:mm A Z'); // Moment

        //newUser[0].tzOffset3 = moment.tz("2016-12-18T20:00:00", "America/Los_Angeles"); // Moment
        newUser[0].tzOffset3 = moment().tz("America/Los_Angeles").format('MMMM d, YYYY H:mm A Z'); // Moment

        newUser[0].tzOffset2 = moment().tz("America/Toronto").format('MMMM d, YYYY H:mm A Z'); // Moment

/*
        console.log('newUser = ' + JSON.stringify(newUser)+"\n"); // debug
        console.log('newUser.timeFrom = ' + newUser[0].timeFrom+"\n"); // debug
        console.log('newUser.timeTo = ' + newUser[0].timeTo+"\n"); // debug
        console.log('newUser.tzOffset1 = ' + newUser[0].tzOffset1+"\n"); // debug

        console.log('timezone =' + moment.tz("May 12th 2014 8PM", "MMM Do YYYY hA", "America/Toronto")+"\n"); // debug

        console.log('newUser = ' + JSON.stringify(newUser)+"\n"); // debug
*/

        return res.send(newUser);
      });
    });


  });

router.route('/getUserGoogle')
  .get(function (req, res) {

//Tre%27%20Grisby
//req.query.username = "Tre' Grisby"; // debug

    //userRoles( userId, function(err, roles) )
    acl.userRoles(req.query.username, function (err, roles) {
      console.log('roles = ' + roles);
    });

    //isAllowed( userId, resource, permissions, function(err, allowed) )
    acl.isAllowed(req.query.username, req.query.username, 'edit', function (err, allowed) {

      console.log('acl.isAllowed begins, allowed = ' + allowed); // debug

      if (err) {
        return res.send(500, err);
      };

      if (!allowed) {
        return res.sendStatus(401);
      };

      People.find({ "username": req.query.username }, function (err, mongoUser) {

        var newUser = JSON.parse(JSON.stringify(mongoUser));

        newUser[0].timeFrom = moment().from(mongoUser.usrLastLogin); // Moment
        newUser[0].timeTo = moment().to('2016-12-31'); // Moment

        //newUser[0].tzOffset1 = moment().tz("2016-12-18T20:00:00", "America/New_York"); // Moment
        newUser[0].tzOffset1 = moment().tz("America/New_York").format('MMMM d, YYYY H:mm A Z'); // Moment

        //newUser[0].tzOffset3 = moment.tz("2016-12-18T20:00:00", "America/Los_Angeles"); // Moment
        newUser[0].tzOffset3 = moment().tz("America/Los_Angeles").format('MMMM d, YYYY H:mm A Z'); // Moment

        newUser[0].tzOffset2 = moment().tz("America/Toronto").format('MMMM d, YYYY H:mm A Z'); // Moment

        return res.send(newUser);
      });
    });


  });

//modify profile data
router.route('/updateUser/:id')
  .put(function (req, res) {

    acl.isAllowed(req.query.username, req.query.id, 'owner', function (err, allowed) {
      if (err) {
        return res.send(500, err);
      }

      console.log('acl.isAllowed' + allowed); // debug

      if (!allowed) {
        return res.sendStatus(401);
      }
    });

    /*
        acl.middleware(2, req.session.userId, 'put', function (err, res) {
          
          console.log('begin acl.middleware'); // DEBUG
    
          if (res) {
    
            console.log('user allowed to update'); // DEBUG
    
            return next();
          } else {
    
            console.log('no updates allowed'); // DEBUG
    
            return res.end();
          }
        });
        */

    console.log('updateUser req.params = ' + JSON.stringify(req.params)); // DEBUG

    People.find({ "username": req.query.username }, function (err, mongoUser) {

      var upUser = new People(user);

      upUser.usrEmail = req.params.value;
      upUser.usrOccupation = req.params.occupation;
      upUser.usrSkills = req.params.skills;

      upUser.save(function (err) {
        if (err) {
          console.log('Error saving user: ' + err);
          throw err;
        }
      });

      return res.send(mongoUser);
    });
  });

module.exports = router;