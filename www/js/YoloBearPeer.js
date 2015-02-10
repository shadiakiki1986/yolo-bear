function YoloBearPeer($scope) {
  
  $scope.conns={};
  $scope.msgs={};
  $scope.lists={};
  $scope.msg='';
  $scope.id=null;

    $scope.peer = new Peer({key: 'peerjs', host: 'localhost', port: 9000, path: '/', debug: false});
    $scope.peer.on('open', function(id){
      $scope.$apply(function() {
	$scope.id=id;
	$scope.msgs[id]=[];
	$scope.lists[id]=[];
      });
    });  
  
    // Await connections from others
    $scope.peer.on('connection', function(c) { $scope.$apply(function() { $scope.connect(c); }); });

  
  $scope.connect=function(c) {
    $scope.msgs[c.peer]=[];
    $scope.lists[c.peer]=[];
    c.on('data', function(data){ $scope.$apply(function() {
	if(data.type) {
		switch(data.type) {
		case "listRequest": sendListResponse(c.peer); break;
		case "listResponse": $scope.lists[c.peer]=data.list; break;
		default: alert("undefined data type");
		}
	} else {
		$scope.msgs[c.peer].push({ts:moment(),msg:data,to:$scope.id});
	}
    }); });
    c.on('close', function(err){ $scope.$apply(function() { delete $scope.conns[c.peer]; }); });
    $scope.conns[c.peer]=c;
    $scope.peers().map(function(x) { sendListResponse(x); });
  };
  
  $scope.connectOut=function(id) {
    c=$scope.peer.connect(id);
    c.on('open', function() { $scope.$apply(function() {
	$scope.connect(c);
	//sendListRequest(c.peer);
	//sendListResponse(c.peer);
    }); });
    c.on('error', function(err){ alert("Failed to connect to "+c.peer); });
  };
  
  $scope.send=function(id) {
    $scope.conns[id].send($scope.msg);
    $scope.msgs[$scope.id].push({ts:moment(),msg:$scope.msg,to:id});
    $scope.msg='';
  };

  sendListResponse=function(id) {
    $scope.conns[id].send({type:"listResponse",list:$scope.peers()});
  };
  sendListRequest=function(id) {
    $scope.conns[id].send({type:"listRequest"});
  };


  $scope.peers=function() { return Object.keys($scope.conns); };
  $scope.peerMsgs=function(id) { return $scope.msgs[id]; };
  $scope.peerList=function(id) { if($scope.peers()<=1) return ""; else return "("+$scope.lists[id].filter(function(x) { return $scope.peers().indexOf(x)==-1 && x!=$scope.id; }).join()+")"; };


}
