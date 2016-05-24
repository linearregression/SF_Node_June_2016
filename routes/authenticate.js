var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    /*
    // custom callback
    router.get('/login', function(req,res,next){
        passport.authenticate('local', function(err,user, info){
            
            if (err) { return next(err);}
            
            if (!user) { return res.redirect('/login');}
            
            req.logIn(user, function(err){
                
                if (err) { return next(err);}
                return res.redirect('/users/' + user.username);
            });
        })(req,res,next);
    });
    */

    router.post('/login', // passport
        passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    router.post('/signup', // passport
    passport.authenticate('signup'), 
        function (req, res) {
            res.send(req.user);
        });

    router.get('/logout', function (req, res) { // passport
        req.logout();
        res.redirect(200, '/');
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
            failureRedirect: '/login'
        }),
        function (req, res) {
            // Successful authentication, redirect
            res.redirect('/google');
        });

    // Meetup login
    router.get('/meetup', passport.authenticate('meetup', { scope: 'basic' })); // passport  

    router.get('/meetup/callback', // passport  
        passport.authenticate('meetup', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect
            res.redirect('/google');
        });

    return router;
};