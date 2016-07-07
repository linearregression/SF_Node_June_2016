
var express = require('express'); // express
var app_express = express(); // express

var helmet = require('helmet'); // helmet
app_express.use(helmet());  // helmet

app_express.use(express.static(__dirname + '/public')); // express

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

var config = require('./config-sfnode');// passport
var session = require('express-session'); // passport, express-session
app_express.set('trust proxy', 1); // express-session
// passport, express-session
app_express.use(session({ 
    secret: config.secret.phrase
    , name: 'sessionSfNodeId' // set session ID, more secure option
    , cookie: { 
        maxAge: 60000
        //, secure: true // https required
        //, httpOnly: true // send cookie over http(s), not client javascript
        //, domain: // domain of the cookie
        //, path: // relative path of the cookie
        //, expires: // set expiration date, not necessary due to maxAge
    }
    , resave: true
    , saveUninitialized: true  
}));

var bodyParser = require('body-parser'); // passport
// passport
app_express.use(bodyParser.urlencoded({
    extended: true
}));
app_express.use(bodyParser.json());// passport
app_express.use(passport.initialize());// passport
app_express.use(passport.session());// passport



app_express.use('/auth', authenticate); // passport
app_express.use('/api', api); // passport

//[NOTE] show this response with Morgan logger, then REMOVE
//app_express.get('/', function (req, res) {res.sendStatus(222)}); // express

var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('keys/hostkey.pem'),
    cert: fs.readFileSync('keys/hostcert.pem')
};

https.createServer(options, app_express).listen(443); // passport

// express
var server = app_express.listen({
    host: 'localhost',
    port: 3000
}, function () {
    var vPort = server.address().port;
    var vHost = server.address().address;
    var vIp = server.address().family;

    console.log('Server listening on ' + vPort + ", as " + vIp + ", IP Address " + vHost);
}); 