var linkPortApp = angular.module('linkPortApp', ['btford.socket-io']).
factory('mySocket', function (socketFactory) {
    return socketFactory();
});

linkPortApp.controller('LinkPortCtrl', function($scope, mySocket){
    var connectedText = "Connected";
    var disconnectedText = "Disconnected";
    var reconnectingText = "Reconnecting";
    var sendText = "Send";
    var waitText = "Waiting for connection/users";
    var pendingLink = null;
    $scope.statusText = "Connecting";
    connected = false;
    $scope.userCount = 0;
    $scope.buttonText = sendText;
    var sendIfPossible = function (){

        if(connected && $scope.userCount > 0 && pendingLink){
            mySocket.emit('url transfer', pendingLink);
            pendingLink = null;
            $scope.link = '';
            $scope.buttonText = sendText;
        }
    };

    var onConnect = function (){
        $scope.statusText = connectedText;
        connected = true;
        sendIfPossible();
    };
    
    
    $scope.shareLink = function(){
        pendingLink = $scope.link;
        if(!connected || $scope.userCount === 0){
            $scope.buttonText = waitText;
        }
        sendIfPossible();
    };
    
    mySocket.on('connect', function(link){
        onConnect();
    });
        
    mySocket.on('reconnect', function(link){
        onConnect();
    });

    mySocket.on('disconnect', function(link){
        $scope.status = disconnectedText;
        $scope.userCount = 0;
        connected = false;
    });

    mySocket.on('reconnecting', function(link){
        $scope.status = reconnectingText;
    });


    //When url transfer is received, open link
    mySocket.on('url transfer', function(link){
        mySocket.disconnect();
        window.open(link,"_self");
    });

    //update on user's connectedText is received
    mySocket.on('count', function(total){
        $scope.userCount = total - 1;
        if($scope.userCount > 0){
            sendIfPossible();
        }
    });

});
