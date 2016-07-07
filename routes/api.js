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
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};

router.use('/getUser', isAuthenticated); // passport
router.use('/updateUser/:id', isAuthenticated); // passport

var Acl = require('acl'); // node_acl

var acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_', true)); // node_acl

router.route('/getUser')
  .get(function (req, res) {

    //userRoles( userId, function(err, roles) )
    acl.userRoles(req.query.username, function (err, roles) {
      console.log('roles = ' + roles);
    });

    //isAllowed( userId, resource, permissions, function(err, allowed) )
    acl.isAllowed(req.query.username, req.query.username, 'edit', function (err, allowed) {
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

        newUser[0].tzOffset1 = moment().tz("America/New_York").format('MMMM d, YYYY H:mm A Z'); // Moment

        newUser[0].tzOffset3 = moment().tz("America/Los_Angeles").format('MMMM d, YYYY H:mm A Z'); // Moment

        newUser[0].tzOffset2 = moment().tz("America/Toronto").format('MMMM d, YYYY H:mm A Z'); // Moment

        return res.send(newUser);
      });
    });


  });

router.route('/getUserGoogle')
  .get(function (req, res) {

    //userRoles( userId, function(err, roles) )
    acl.userRoles(req.query.username, function (err, roles) {
      console.log('roles = ' + roles);
    });

    //isAllowed( userId, resource, permissions, function(err, allowed) )
    acl.isAllowed(req.query.username, req.query.username, 'edit', function (err, allowed) {
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

        newUser[0].tzOffset1 = moment().tz("America/New_York").format('MMMM d, YYYY H:mm A Z'); // Moment

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

      if (!allowed) {
        return res.sendStatus(401);
      }
    });

    People.find({ "username": req.query.username }, function (err, mongoUser) {

      var upUser = new People(user);

      upUser.usrEmail = req.params.value;
      upUser.usrOccupation = req.params.occupation;
      upUser.usrSkills = req.params.skills;

      upUser.save(function (err) {
        if (err) {
          throw err;
        }
      });

      return res.send(mongoUser);
    });
  });

module.exports = router;