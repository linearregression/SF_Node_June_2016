var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    router.post('/login', // passport
        passport.authenticate('login'),
        function (req, res) {
            res.send(req.user);
        }
    );

    router.post('/signup', // passport
        passport.authenticate('signup'),
        function (req, res) {
            res.send(req.user);
        });

    router.get('/logout', function (req, res) { // passport
        req.logout();
        res.redirect('http://localhost:3000/index.html'); // NOTE - redirect to Logout page
    });

    router.get('/loggedin', function (req, res) { // passport
        res.send(req.isAuthenticated() ? req.user.username : '0');
    });

    router.get('/google', // passport

        passport.authenticate('google',
            { scope: ['https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'] }
        )
    );

    router.get('/google/oauth2callback', // passport
        passport.authenticate('google', {
            failureRedirect: 'http://localhost:3000/index.html' // NOTE - redirect to Failed Login page
        }),
        function (req, res) {            
            res.redirect('http://localhost:3000/profile.html');
        });

    return router;
};