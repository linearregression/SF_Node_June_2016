var express = require('express');//express
var router = express.Router();//express

var mongoose = require('mongoose'); // mongoose
var db = require('../models/db'); // mongoose
var People = mongoose.model('People'); // mongoose

var http = require('http');
var https = require('https');
var config = require('../config-sfnode');//passport

/*
var isAuthenticated = function (req, res, next) { // passport
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};

router.use('/getUser', isAuthenticated); // passport
router.use('/updateUser/:id', isAuthenticated); // passport
*/

// passport
var isAuthenticated = function (req, res, next) {

  console.log('begin isAuthenticated'); // DEBUG

  if (req.isAuthenticated()) {

    return next();
  }
  res.sendStatus(401);
};

//router.use('/getUser', isAuthenticated); // passport
router.use('/updateUser/:id', isAuthenticated); // passport

//router.use('/getUser', acl.middleware());

var Acl = require('acl'); // node_acl

var acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_', true)); // node_acl

/*
router.get('/getUser', function (req, res) {

  console.log('getUser begins'); // debug

  console.log('getUser req.query.username ' + req.query.username); // debug

  //userRoles( userId, function(err, roles) )
  acl.userRoles(req.query.username, function (err, roles) {
    console.log('roles = ' + roles);
  });

  //isAllowed( userId, resource, permissions, function(err, allowed) )
  acl.isAllowed(req.query.username, req.query.username, 'GET', function (err, allowed) {

    console.log('acl.isAllowed begins' + allowed); // debug

    if (err) {
      return res.send(500, err);
    };

    //console.log('acl.isAllowed' + allowed); // debug

    if (!allowed) {
      return res.sendStatus(401);
    };

    People.find({ "username": req.query.username }, function (err, mongoUser) {
      return res.send(mongoUser);
    });

  });
});
*/

router.route('/getUser')
  .get(function (req, res) {

/*
    acl.middleware(1, req.session.userId, 'get', function (err, res) {
      
      console.log('begin acl.middleware'); // DEBUG
 
      if (res) {
 
        console.log('getUser allowed'); // DEBUG
 
        return next();
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
      return res.send(mongoUser);
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