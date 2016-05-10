var express = require('express'); // express
var app = express(); // express

app.get('/', function(req,res){
    res.send(222); // [NOTE] show this response with Morgan logger, then change to ( res.send(222); )
}); // express

var server = app.listen({
    host: 'localhost',
    port: 3000
}, function () {
    var vPort = server.address().port;
    var vHost = server.address().address;
    var vIp = server.address().family;

    console.log('listening on ' + vPort + ", as " + vIp + ", IP Address " + vHost);
}); // express