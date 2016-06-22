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
        
        console.log('(/loggedin) req.isAuthenticated() = ' + req.isAuthenticated()); // DEBUG

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
            , successRedirect:'http://localhost:3000/profile.html'
        }),
        function (req, res) {
            console.log('google callback req.session = ' + JSON.stringify(req.session.passport)); // DEBUG
            //res.redirect('http://localhost:3000/profile.html?username=' + req.session.passport.user);
            //res.redirect('http://localhost:3000/profile.html')
            res.send(req.user);
        });

    return router;
};