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
            res.redirect('http://localhost:3000/gProfile.html?username='+ req.user.username);
        });

    return router;
};