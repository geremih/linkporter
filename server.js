var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var path = require('path');




app.use(express.static(path.join(__dirname, 'public')));
app.get('/:id', function(req , res) {
    res.sendfile('public/index.html');
});


io.on('connection', function(socket){
    console.log('a user connected');

    //Hack to get rooms before disconnection
    socket.onclose = function(reason){
        
        console.log('Disconnect called');
        var rooms = socket.rooms;
        console.log('The rooms of the socket are : ', rooms);
        for(var i=0; i< rooms.length;i++){
            var roomName = rooms[i];
            //this should be if roomName !== socket.id
            room = io.nsps['/'].adapter.rooms[roomName];
            console.log('The room count is ', Object.keys(room).length);
            io.sockets.in(roomName).emit('count',  Object.keys(room).length - 1);
        }
        Object.getPrototypeOf(this).onclose.call(this,reason);
    };
    socket.on('url transfer', function(url){
        console.log("Received url: ", url);
        var rooms = socket.rooms;
        console.log('rooms are '. rooms);
        for(var i=0; i< rooms.length;i++){            
            console.log("room name is: ", rooms[i]);
            var room = rooms[i];
            if(room){
                console.log('Sending url to room: ', room);
                socket.broadcast.to(room).emit('url transfer', url) ;
            }
        }

    });

    socket.on('join', function(roomName){
        console.log("Joining room: ", roomName);
        socket.join(roomName);
        socket.emit('join_success');
        room = io.nsps['/'].adapter.rooms[roomName];
        io.sockets.in(roomName).emit('count',  Object.keys(room).length);
    });


});




http.listen(process.env.PORT || 3000 , function(){
    console.log("listening on port 3000");
});


