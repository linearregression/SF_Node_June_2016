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

router.route('/getUser')
  .get(function (req, res) {

console.log('req.params' + JSON.stringify(req.params)); // DEBUG
console.log('req.body' + JSON.stringify(req.body)); // DEBUG
console.log('req.query' + JSON.stringify(req.query)); // DEBUG

    People.find({"username":req.query.username},function(err,mongoUser){
      return res.send(mongoUser);
    });
  });

module.exports = router;