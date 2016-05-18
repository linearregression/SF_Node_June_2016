var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    router.post('/login', passport.authenticate('login'), // passport
        function (req, res) {
            res.send(req.user);
        });

    router.post('/signup', passport.authenticate('signup'), // passport
        function (req, res) {
            res.send(req.user);
        });

    router.get('/signout', function (req, res) { // passport
        req.logout();
        res.redirect(200, '/#/login');
    });

    router.get('/loggedin', function (req, res) { // passport
        res.send(req.isAuthenticated() ? req.user.username : '0');
    });

    // Google OAuth2 login
    // Redirect the user to the OAuth 2.0 provider for authentication.  When
    // complete, the provider will redirect the user back to the application at
    //     '/google/oauth2callback'
    router.get('/google', // passport
        passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'] }), function (req, res) { });

    // The OAuth 2.0 provider has redirected the user back to the application.
    // Finish the authentication process by attempting to obtain an access
    // token.  If authorization was granted, the user will be logged in.
    // Otherwise, authentication has failed.
    router.get('/google/oauth2callback', // passport
        passport.authenticate('google', {
            failureRedirect: '/auth/login'
        }),
        function (req, res) {
            // Successful authentication, redirect
            res.redirect('/');
        });
        
        // Meetup login
    router.get('/meetup', passport.authenticate('meetup', { scope: 'basic' })); // passport  

    router.get('/meetup/callback', // passport  
        passport.authenticate('meetup', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect
            res.redirect('/');
        });

    return router;
};