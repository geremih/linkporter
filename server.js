var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

app.get('/', function(req , res) {
    res.sendfile('public/index.html');
});


io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('url transfer', function(url){
        console.log("Received url: ", url);
        socket.broadcast.emit('url transfer', url);
    });
});


http.listen(3000 , function(){
    console.log("listening on port 3000");
});


