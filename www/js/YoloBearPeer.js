function YoloBearPeer($scope) {
  
  $scope.conns={};
  $scope.msgs={};
  $scope.lists={};
  $scope.msg='';
  $scope.id=null;
  $scope.admins={}; // associative array of timestamps, where the keys are the peer ids. This gives a sorted list of prioritization for being admin on the tournament
  $scope.alive={};

    $scope.peer = new Peer({key: 'peerjs', host: 'localhost', port: 9000, path: '/', debug: false});
    $scope.peer.on('open', function(id){
      $scope.$apply(function() {
	$scope.id=id;
	$scope.msgs[id]=[];
	$scope.lists[id]=[];
        $scope.admins[id]=moment().valueOf();
      });
    });  
  
    // Await connections from others
    $scope.peer.on('connection', function(c) {
        $scope.$apply(function() {
            $scope.admins[c.peer]=moment().valueOf(); // prioritize by time of connection
            $scope.broadcastListResponse();
            $scope.connect(c);
        });
    });

  
  $scope.connect=function(c) {
    $scope.msgs[c.peer]=[];
    $scope.lists[c.peer]=[];
    c.on('data', function(data){ $scope.$apply(function() {
	if(data.type) {
                wia=$scope.whoIsAdmin();
                wia2=$scope.whoIsAdmin2();

		switch(data.type) {
                case "listRequest": sendListResponse(c.peer); break;
		case "listResponse":
                    if(!($scope.id==wia&&wia2=="")&&!(c.peer==wia||c.peer==wia2)) return; // only listen to admins
                    $scope.lists[c.peer]=Object.keys(data.admins);
                    $scope.admins=data.admins;
                    // update who I think the admins are
                    wia=$scope.whoIsAdmin();
                    wia2=$scope.whoIsAdmin2();
                    if(wia !=$scope.id && !$scope.conns.hasOwnProperty(wia )) {
                        console.log("Need to connect to ",wia ); $scope.connectOut(wia );
                    } else {
                        if(wia2!=$scope.id && !$scope.conns.hasOwnProperty(wia2)) { console.log("Need to connect to ",wia2); $scope.connectOut(wia2); }
                    }
                    break;
                case "tournament":
                    if(c.peer!=wia) return; // only listen to first admin
                    $scope.$emit('responseDataBroadcast',data.ybt);
                    break;
		default: alert("undefined data type");
		}
	} else {
		$scope.msgs[c.peer].push({ts:moment(),msg:data,to:$scope.id});
	}
    }); });
    c.on('close', function(err){ $scope.$apply(function() {
        updatePeerStatus(c.peer);
    });
    });
    $scope.conns[c.peer]=c;
    $scope.alive[c.peer]=true;
  };

  connectOutId={};
  $scope.connectOut=function(id) {
    if(connectOutId.hasOwnProperty(id)) return; // already pending request to connect
    connectOutId[id]=setTimeout(function() { updatePeerStatus(id); delete connectOutId[id]; console.log("connect out timeout"); }, 5000); // must connect within 5 seconds
    c=$scope.peer.connect(id);
    c.on('open', function() { $scope.$apply(function() {
        if(connectOutId.hasOwnProperty(id)) { clearTimeout(connectOutId[id]); delete connectOutId[id]; }
	$scope.connect(c);
        sendListRequest(id);
    }); });
    c.on('error', function(err){ alert("Failed to connect to "+c.peer); });
  };
  

  updatePeerStatus=function(id) {
    $scope.alive[id]=false;
    delete $scope.admins[id];
    $scope.broadcastListResponse(); // only admins broadcast since only admins are listened to
  };

  $scope.send=function(id) {
    $scope.conns[id].send($scope.msg);
    $scope.msgs[$scope.id].push({ts:moment(),msg:$scope.msg,to:id});
    $scope.msg='';
  };

  sendListResponse=function(id) {
    $scope.conns[id].send({type:"listResponse",admins:$scope.admins});
  };
  $scope.broadcastListResponse = function() {
    if($scope.id==$scope.whoIsAdmin()||$scope.id==$scope.whoIsAdmin2()) {
      $scope.peers().map(function(x) { if($scope.alive[x]) sendListResponse(x); });
    }
  }; // broadcast my upcoming new connection before connecting

  sendListRequest=function(id) {
    $scope.conns[id].send({type:"listRequest"});
  };



  $scope.peers=function() { return Object.keys($scope.conns); };
  $scope.peerMsgs=function(id) { return $scope.msgs[id]; };
  $scope.peerList=function(id) { if($scope.peers()<=1) return ""; else return "("+$scope.lists[id].filter(function(x) { return $scope.peers().indexOf(x)==-1 && x!=$scope.id; }).join()+")"; };
  $scope.whoIsAdmin= id => Object.keys($scope.admins).filter(x => $scope.admins[x]==Object.values($scope.admins).min())[0];
  $scope.whoIsAdmin2= id => (Object.keys($scope.admins).length<=1?"":Object.keys($scope.admins).filter(x => $scope.admins[x]==Object.values($scope.admins).diff(Object.values($scope.admins).min()).min())[0]);

  $scope.$on('requestDataBroadcast',function(event,ybt) {
    if($scope.id==$scope.whoIsAdmin()||$scope.id==$scope.whoIsAdmin2()) {
      $scope.peers().map(function(x) { if($scope.alive[x]) {
        $scope.conns[x].send({type:"tournament",ybt:ybt});
      } });
    }
  });

  $scope.$on('amIAdmin',function(event) { $scope.$parent.iAmAdminV=($scope.whoIsAdmin()==$scope.id); });


}
