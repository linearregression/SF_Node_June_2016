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
        res.redirect('/');
    });

    router.get('/loggedin', function (req, res) { // passport
        res.send(req.isAuthenticated() ? req.user.username : '0');
    });

    // Google OAuth2 login
    // Redirect the user to the OAuth 2.0 provider for authentication.  When
    // complete, the provider will redirect the user back to the application at
    //     '/google/oauth2callback'
    router.get('/google', // passport
        passport.authenticate('google',
            { scope: ['https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'] }));

    // The OAuth 2.0 provider has redirected the user back to the application.
    // Finish the authentication process by attempting to obtain an access
    // token.  If authorization was granted, the user will be logged in.
    // Otherwise, authentication has failed.
    router.get('/google/oauth2callback', // passport
        passport.authenticate('google', {
            failureRedirect: '/'
        }),
        function (req, res) {
            // Successful authentication, redirect
             res.redirect('/');
             
        });

    // Meetup login
    router.get('/meetup',
        passport.authenticate('meetup')
        ); // passport  

    router.get('/meetup/callback', // passport  
        passport.authenticate('meetup', {
            failureRedirect: '/'
        }),
        function (req, res) {
            // Successful authentication, redirect
            res.redirect('/');
        });

    /*
    Meetup error
    
    Invalid Authorization request - 
    https://secure.meetup.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A443%2Fauth%2Fmeetup%2Fcallback&scope=basic&client_id=emqbu6doknhsgs3h409rnm7u26
    
    */
    return router;
};