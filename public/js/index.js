var socket = io.connect();
var count = 0;
var url_queue = [];



$( function (){

    console.log("File loaded");
    function send_url (url){
        socket.emit('url transfer',url);
        $("#submit-button").text("Send");
        
    }

    
    $('form').submit(function(){
        var url =  $('#url').val();
        if(count === 0){
            url_queue.push(url);
            $("#submit-button").text("Waiting for users to connect");
        }
        else{
            send_url(url);
            $('#url').val('');
        }
        return false;
    });

    
    socket.on('url transfer', function(url){
        window.open(url,"_self");
    });

    socket.on('count', function(total){
        console.log("count calleed");
        count = total -1;
        $('#count').text(count);
        if(count > 0){
            while(url_queue.length !== 0)
            {
                send_url(url_queue.pop());
                $('#url').val('');
            }
        }
    });


});


