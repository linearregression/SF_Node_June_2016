var express = require('express'); // express
var app_express = express(); // express

app_express.use(express.static(__dirname + '/public')); //express

var passport = require('passport'); // passport
var authenticate = require('./routes/authenticate')(passport); // passport
var initPassport = require('./routes/passport-init')(passport); // passport
var api = require('./routes/api');

var mongoose = require('mongoose'); // mongoose
var db = require('./models/db'); // mongoose

// [NOTE] use fs for writing logs to file
// var fs = require('fs'); // morgan
var logger = require('morgan'); // morgan

// [NOTE] logging format that works well for development
app_express.use(logger('dev'));  // morgan

/*
// [NOTE] Standard log output
app_express.use('common');  // morgan
// [NOTE] Minimal output
app_express.use('tiny');  // morgan

// [NOTE] Write logs to file
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'}); // morgan
app_express.use(morgan('common', {stream: accessLogStream})); // morgan
*/

var session = require('express-session');// passport
var bodyParser = require('body-parser'); // passport
var cookieParser = require('cookie-parser'); // passport
var session = require('express-session'); // passport

// Initialize Passport
app_express.use(cookieParser());// passport
app_express.use(bodyParser());// passport
var config = require('./config-sfnode');// passport
app_express.use(session({ secret: config.secret.phrase }));// passport
app_express.use(passport.initialize());// passport
app_express.use(passport.session());// passport

app_express.use('/auth', authenticate); // passport
app_express.use('/api', api); // passport

//[NOTE] show this response with Morgan logger, then REMOVE
//app_express.get('/', function (req, res) {res.sendStatus(222)}); // express

/*
https notes:
( https://nodejs.org/api/tls.html )
( https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2#.f0w1qh5wo )
( https://blogs.msdn.microsoft.com/robert_mcmurray/2013/11/15/how-to-trust-the-iis-express-self-signed-certificate/ ) windows solution for cert export
( https://code.google.com/archive/p/openssl-for-windows/downloads ) download openssl from google
( http://www.c-sharpcorner.com/UploadFile/82b980/creating-https-server-with-nodejs/ ) this worked!!!
- ( C:\Users\Tre'\openssl-0.9.8k_X64\bin ) my location to generate keys
*/

var Acl = require('acl'); // node_acl

var acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_', true)); // node_acl

//node_acl
//Adds the given permissions to the given roles over the given resources.
acl.allow([
    {
        roles: ['guest', 'guest']
        , allows: [
            { resources: 'profile', permissions: 'get' }
            , { resources: 'updateUser', permissions: 'get' }
        ]
    }
], function (err) {
    if (err) { console.log('save error, ' + err); }

    console.log('acl roles, permissions, and resources created in server.js' + '\n'); // DEBUG

});

var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('keys/hostkey.pem'),
    cert: fs.readFileSync('keys/hostcert.pem')
};

https.createServer(options, app_express).listen(443); // passport
// http://www.meetup.com/meetup_api/auth/#oauth2

var server = app_express.listen({
    host: 'localhost',
    port: 3000
}, function () {
    var vPort = server.address().port;
    var vHost = server.address().address;
    var vIp = server.address().family;

    console.log('listening on ' + vPort + ", as " + vIp + ", IP Address " + vHost);
}); // express