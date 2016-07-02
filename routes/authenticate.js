var express = require('express'); // express
var router = express.Router(); // express

module.exports = function (passport) {

    // passport
    router.post('/login',
        passport.authenticate('login'),
        function (req, res) {
            res.send(req.user);
        }
    );

    // passport
    router.post('/signup',
        passport.authenticate('signup'),
        function (req, res) {
            res.send(req.user);
        });

    // passport
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('http://localhost:3000/index.html'); // NOTE - redirect to Logout page
    });

    // passport
    router.get('/loggedin', function (req, res) {

        
        /*

        
        console.log('(/loggedin) req.isAuthenticated() = ' + req.isAuthenticated()); // DEBUG
        console.log('(/loggedin) req.user = ' + JSON.stringify(req.user)); // DEBUG
        --

        for (var property in req) {

    var tempValue = req[property];

    if (req.hasOwnProperty(property)) {

        console.log('name = ' + property);
        
        //console.log(property + ', value = ' + tempValue + '\n');
        function replacer(property, tempValue) {
            if (typeof tempValue === "string") {
                return tempValue;
            };
            if (typeof tempValue === "number") {
                return tempValue;
            };

            if (typeof tempValue === "object") {
                return tempValue;
            };

            if (property == "socket") {
                return undefined;
            };


            return undefined;
        };

        if (tempValue !== null) {

            console.log('!null property name = ' + property);
            console.log(property + ', type = ' + typeof property);
            console.log(property + ', value = ' + tempValue + '\n');
        }else{
            console.log('null property name = ' + property + ' = ' + JSON.stringify(tempValue, replacer) + ' ... \n');
        };
    };
        */
        /*
        property name: 
        
        _readableState
        readable
        domain
        _events
        _eventsCount
        _maxListeners
        socket
        connection
        httpVersionMajor
        httpVersionMinor
        httpVersionMajorcomplete
        headers
        rawHeaders
        trailers
        rawTrailers
        upgrade
        urlmethod
        statusCode
        statusMessage
        client
        _consuming
        _dumped
        nextTickbaseUrl
        originalUrl
        _parsedUrl
        params
        query
        res_parsedOriginalUrl
        _startAt
        _startTime
        _remoteAddress
        body
        sessionStore
        sessionID
        session_passport
        router
                        
        */

        res.send(req.isAuthenticated() ? req.user.username : '0');
    });

    // passport
    router.get('/google',

        passport.authenticate('google',
            { scope: ['https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'] }
        )
    );

    // passport
    router.get('/google/oauth2callback',
        passport.authenticate('google', {
            failureRedirect: 'http://localhost:3000/index.html' // NOTE - redirect to Failed Login page
        }),
        function (req, res) {
            console.log('google callback req.session = ' + JSON.stringify(req.session.passport)+'\n'); // DEBUG
            //console.log('google callback req.user = ' + JSON.stringify(req.user)); // DEBUG
            console.log('google callback req.user = ' + JSON.stringify(req.user.username)); // DEBUG

/*
oauth2callback name = _readableState
oauth2callback name = readable
oauth2callback name = domain
oauth2callback name = _events
oauth2callback name = _eventsCount
oauth2callback name = _maxListeners
oauth2callback name = socket
oauth2callback name = connection
oauth2callback name = httpVersionMajor
oauth2callback name = httpVersionMinor
oauth2callback name = httpVersion
oauth2callback name = complete
oauth2callback name = headers
oauth2callback name = rawHeaders
oauth2callback name = trailers
oauth2callback name = rawTrailers
oauth2callback name = upgrade
oauth2callback name = url
oauth2callback name = method
oauth2callback name = statusCode
oauth2callback name = statusMessage
oauth2callback name = client
oauth2callback name = _consuming
oauth2callback name = _dumped
oauth2callback name = next
oauth2callback name = baseUrl
oauth2callback name = originalUrl
oauth2callback name = _parsedUrl
oauth2callback name = params
oauth2callback name = query
oauth2callback name = res
oauth2callback name = _parsedOriginalUrl
oauth2callback name = _startAt
oauth2callback name = _startTime
oauth2callback name = _remoteAddress
oauth2callback name = body
oauth2callback name = sessionStore
oauth2callback name = sessionID
oauth2callback name = session
oauth2callback name = _passport
oauth2callback name = route
oauth2callback name = user
oauth2callback name = authInfo
*/
            res.redirect('http://localhost:3000/gProfile.html?username='+ req.user.username);
        });

    return router;
};