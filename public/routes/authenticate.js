var express = require('express');
var router = express.Router();

module.exports = function (passport) {

    router.post('/login', passport.authenticate('login'),
        function (req, res) {
            res.send(req.user);
            //res.sendStatus(500); // [DEBUG] cause an error intentionally
        });
        
        return router;
};