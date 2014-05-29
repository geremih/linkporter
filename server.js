var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var path = require('path');
app.get('/', function(req , res) {
    res.sendfile('public/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

var  count= 0;
io.on('connection', function(socket){
    console.log('a user connected');
    count+=1;
    socket.broadcast.emit('count', count);
    socket.emit('count', count);
    socket.on('url transfer', function(url){
        console.log("Received url: ", url);
        socket.broadcast.emit('url transfer', url);
    });

    socket.on('disconnect', function(){
        count -=1;
        socket.broadcast.emit('count', count);
    });
});




http.listen(process.env.PORT || 3000 , function(){
    console.log("listening on port 3000");
});


