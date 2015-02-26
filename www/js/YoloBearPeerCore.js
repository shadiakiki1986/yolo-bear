YoloBearPeerCore=function($scope) {
    $scope.peer = new Peer({key: PEERJS_KEY, host: PEERJS_HOST, port: PEERJS_PORT, path: PEERJS_PATH, debug: PEERJS_DEBUG});
    $scope.peer.on('open', function(id){
      $scope.$apply(function() {
        $scope.connAttemptN=0;
        $scope.autoReconnectFailed=false;
        $scope.peerError=false;
	$scope.id=id;
	$scope.msgs[id]=[];
	$scope.lists[id]=[];
        $scope.admins[id]=moment().valueOf();
        $scope.nicks[id]=$scope.nickName; // my own nickname

        // get list of peers on server
	$scope.listAllPeers();
      });
    });  
  
    // Await connections from others
    $scope.peer.on('connection', function(c) {
        $scope.$apply(function() {
            $scope.admins[c.peer]=moment().valueOf(); // prioritize by time of connection
            $scope.nicks[c.peer]=c.metadata.nick;
            $scope.broadcastListResponse();
            $scope.connect(c);
        });
    });

    $scope.peer.on('disconnected', $scope.autoReconnect);
    $scope.peer.on('error', function(err) {
      $scope.peerError=true;
      switch(err.type) {
        case "server-error":
        case "network": $scope.autoReconnect(); break;
        case "peer-unavailable":
          $scope.peerError=false; // not really a server error
          id=err.message.split(" ").pop();
           if($scope.connectOutId.hasOwnProperty(id)) {
             clearTimeout($scope.connectOutId[id]);
             $scope.$apply(function() {
               delete $scope.connectOutId[id];
               $scope.conns[id]={open:false};
             });
           }
           break;
        default: alert("Server error: "+err.type);
      };
    });

  return $scope;
};
