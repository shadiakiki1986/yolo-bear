function YoloBearPeer($scope,$http) {
  
  $scope.nickName={
    val:null,
    old:null,
    pwd:Math.random().toString(36).substring(7),
    warning:"",
    error:""
  };

  $scope.regist={
    email0:null,
    pwd:null,
    nick:"", // get this from $scope.nickName.val
    peerId:"",
    metaD:"",
    warning:"",
    error:"",
    loggedIn:false,
    inProgress:false
  };

  $scope.conns={};
  $scope.msgs={};
  $scope.lists={};
  $scope.nicks={};
  $scope.msg='';
  $scope.id=null;
  $scope.admins={}; // associative array of timestamps, where the keys are the peer ids. This gives a sorted list of prioritization for being admin on the tournament

    $scope.connAttemptN=0;

    $scope.peer = null;

    autoReconnectId=null;
    $scope.PEERJS_MAX_RECONN_ATTEMPT=PEERJS_MAX_RECONN_ATTEMPT;
    $scope.autoReconnectFailed=false;
    $scope.peerError=false;
    $scope.autoReconnect=function() {
       if(!autoReconnectId) {
          if($scope.connAttemptN<PEERJS_MAX_RECONN_ATTEMPT) {
            $scope.$apply(function() { $scope.connAttemptN+=1; });
            autoReconnectId=setTimeout(function() {
               autoReconnectId=null;
               $scope.manualConnect();
            }, 3000);
          } else {
             $scope.$apply(function() { $scope.autoReconnectFailed=true; });
          }
       }
    };

    $scope.manualConnect=function() {
               if(!$scope.peer||$scope.peer.destroyed) {
                  $scope = YoloBearPeerCore($scope);
               } else {
                  $scope.peer.reconnect();
               }
    };
    $scope.manualConnect();


  $scope.isUnconnectedToAnyone=function() {
	wia=$scope.whoIsAdmin();
	wia2=$scope.whoIsAdmin2();
	return($scope.id==wia&&wia2=="");
  };
  
  $scope.dataReceiving=false;
  $scope.connect=function(c) {
    $scope.msgs[c.peer]=[];
    $scope.lists[c.peer]=[];
    c.on('data', function(data){ $scope.$apply(function() {
        $scope.dataReceiving=true;
	if(data.type) {
                wia=$scope.whoIsAdmin();
                wia2=$scope.whoIsAdmin2();

		switch(data.type) {
                case "listRequest": sendListResponse(c.peer); break;
                case "dataRequest": $scope.$emit("gotDataRequest",c.peer); break;
		case "listResponse":
                    if(!($scope.id==wia&&wia2=="") && // listen to anybody if unconnected
                       !(c.peer==wia )&&  // listen to admin1
                       !(c.peer==wia2 &&!($scope.conns.hasOwnProperty(wia)&&$scope.conns[wia].open))) // listen to admin2 if admin1 is dead
                          break;
                    $scope.lists[c.peer]=Object.keys(data.admins);
                    $scope.admins=data.admins;
                    $scope.nicks=data.nicks;
                    // update who I think the admins are
                    wia=$scope.whoIsAdmin();
                    wia2=$scope.whoIsAdmin2();
                    if(wia !=$scope.id && (!$scope.conns.hasOwnProperty(wia ) || !$scope.conns[wia].open ) ) {
                        console.log("Need to connect to ",wia );
                        $scope.connectOut(wia );
                    } else {
                        if(wia2!=$scope.id && (!$scope.conns.hasOwnProperty(wia2) || !$scope.conns[wia2].open )) {
                           console.log("Need to connect to ",wia2);
                           $scope.connectOut(wia2);
                        }
                    }
                    break;
                case "tournament":
                    if(c.peer!=wia) break; // only listen to first admin
                    $scope.$emit('responseDataBroadcast',data.ybt);
                    break;
		default: alert("undefined data type");
		}
	} else {
		$scope.msgs[c.peer].push({ts:moment(),msg:data,to:$scope.id});
	}
        setTimeout(function() { $scope.$apply(function() { $scope.dataReceiving=false; }); }, 1000);
    }); });
    c.on('close', function(err){ $scope.$apply(function() {
        updatePeerStatus(c.peer);
    }); });
    $scope.conns[c.peer]=c;
  };

  $scope.connectOutId={};
  $scope.connectOut=function(id) {
    // already pending request to connect
    if($scope.connectOutId.hasOwnProperty(id)) return;

    // if already connected
    if($scope.conns.hasOwnProperty(id)&&$scope.conns[id].open) return;

    // cancel if cannot connect within X seconds
    $scope.connectOutId[id]=setTimeout(function() {
        $scope.$apply(function() {
        updatePeerStatus(id);
        $scope.conns[id]={open:false};
        delete $scope.connectOutId[id];
      })}, PEERJS_TIMEOUT); 

    // connect
    c=$scope.peer.connect(id,{metadata:{nick:$scope.nickName.val}});
    c.on('open', function() { $scope.$apply(function() {
        if($scope.connectOutId.hasOwnProperty(id)) {
           clearTimeout($scope.connectOutId[id]);
           delete $scope.connectOutId[id];
        }
	$scope.connect(c);
        // give up admin so as to accept list response
        $scope.admins[id]=$scope.admins[$scope.whoIsAdmin()]-1;
        // request lists and data
        sendListRequest(id);
        sendDataRequest(id);
    }); });
    c.on('error', function(err){
      alert("Failed to connect to "+c.peer);
    });
  };
  

  updatePeerStatus=function(id) {
    delete $scope.admins[id];
    $scope.conns[id]={};
    $scope.broadcastListResponse(); // only admins broadcast since only admins are listened to
  };

  $scope.send=function(id) {
    $scope.conns[id].send($scope.msg);
    $scope.msgs[$scope.id].push({ts:moment(),msg:$scope.msg,to:id});
    $scope.msg='';
  };

  sendListResponse=function(id) {
    $scope.conns[id].send({type:"listResponse",admins:$scope.admins,nicks:$scope.nicks});
  };
  $scope.broadcastListResponse = function() {
    if($scope.id==$scope.whoIsAdmin()||$scope.id==$scope.whoIsAdmin2()) {
      $scope.peers().map(function(x) { if($scope.conns[x].open) sendListResponse(x); });
    }
  }; // broadcast my upcoming new connection before connecting

  sendListRequest=function(id) {
    $scope.conns[id].send({type:"listRequest"});
  };
  sendDataRequest=function(id) {
    $scope.conns[id].send({type:"dataRequest"});
  };




  $scope.peers=function() { return Object.keys($scope.conns); };
  $scope.peerMsgs=function(id) { return $scope.msgs[id]; };
  $scope.peerList=function(id) {
    if($scope.peers()<=1) return "";
    if(!$scope.lists.hasOwnProperty(id)) return "";
    return "("+$scope.lists[id].filter(function(x) { return $scope.peers().indexOf(x)==-1 && x!=$scope.id; }).join()+")";
  };
  $scope.whoIsAdmin=function() { return Object.keys($scope.admins).filter(function(x) { return $scope.admins[x]==Object.values($scope.admins).min(); })[0]; };
  $scope.whoIsAdmin2= function() { return (Object.keys($scope.admins).length<=1?"":Object.keys($scope.admins).filter(function(x) { return $scope.admins[x]==Object.values($scope.admins).diff(Object.values($scope.admins).min()).min(); })[0]); };

  $scope.doingDataBroadcast=false;
  doingDataBroadcastId=null;
  $scope.$on('requestDataBroadcast',function(event,ybt) {
    if($scope.id==$scope.whoIsAdmin()||$scope.id==$scope.whoIsAdmin2()) {
      $scope.doingDataBroadcast=true;
      $scope.peers().map(function(x) { if($scope.conns[x].open) {
        $scope.conns[x].send({type:"tournament",ybt:ybt});
      } });
      if(doingDataBroadcastId==null) doingDataBroadcastId=setTimeout(function() { $scope.$apply(function() { $scope.doingDataBroadcast=false; }); doingDataBroadcastId=null; }, 1000);
    }
  });

  $scope.$on('requestDataBroadcast2',function(event,ybt,peerId) {
    if($scope.id==$scope.whoIsAdmin()||$scope.id==$scope.whoIsAdmin2()) {
      if($scope.conns[peerId].open) {
        $scope.conns[peerId].send({type:"tournament",ybt:ybt});
      }
    }
  });

  $scope.$on('amIAdmin',function(event) { $scope.$parent.iAmAdminV=($scope.whoIsAdmin()==$scope.id); });

  $scope.$on("assignAdmin1",function(event,id) {
    $scope.admins[id]=$scope.admins[$scope.whoIsAdmin()]-1000;
    $scope.broadcastListResponse();
  });
  $scope.$on("assignAdmin2",function(event,id) {
    $scope.admins[id]=$scope.admins[$scope.whoIsAdmin2()]-1;
    $scope.broadcastListResponse();
  });
  $scope.$on("decideBroadcast",function(event) {
    wia=$scope.whoIsAdmin();
    if($scope.id!=wia&&!$scope.isUnconnectedToAnyone()) {
      $scope.admins[$scope.id]=$scope.admins[wia]-1000;
      $scope.$parent.ybt=new YoloBearTournament();
    }
  });

  $scope.closePeer=function(id) {
    $scope.conns[id].close();
    $scope.conns[id]={};
  };

  $scope.listAllPeersStatus=false;
  $scope.listAllPeers=function() {
    if($scope.peer.disconnected||$scope.peer.destroyed||!$scope.peer.id||$scope.peerError) return; // do nothing

    $scope.listAllPeersStatus=true;

    // cleaning up entries before getting updated list from server
    Object.keys($scope.conns).map(function(x) {
      if(Object.keys($scope.conns[x]).length==0) {
           delete $scope.conns[x];
      } else if(Object.keys($scope.conns[x]).length==1 & Object.keys($scope.conns[x])[0]=="open" & !$scope.conns[x].open) {
          delete $scope.conns[x];
      }
    });

    // get list of peers on server
    $scope.peer.listAllPeers(function(lap) {
      lap
       .filter(function(x) { return x!=$scope.id; })
       .map(function(x) { $scope.$apply(function() {
          if(!$scope.conns.hasOwnProperty(x)) $scope.conns[x]={};
       }); });
      $scope.$apply(function() { $scope.listAllPeersStatus=false; });
    });

    // get list of nicknames on server
    $http.get(YOLOBEAR_SERVER_URL+'/listNick.php').
      success( function(rt) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }

        Object.keys(rt).map(function(x) {
		temp="";
		if(rt[x].nick && rt[x].email0) {
			temp=rt[x].nick+" ("+rt[x].email0+")";
		} else if(rt[x].nick && !rt[x].email0) {
			temp=rt[x].nick;
		} else if(!rt[x].nick && rt[x].email0) {
			temp=rt[x].email0;
		} else {
			temp="";
		}
		$scope.nicks[x]=temp;

		// if found other nickname with registered email as mine, I must have been logged out
		if(rt[x].email0==$scope.regist.email0 && $scope.regist.loggedIn && x!=$scope.id) $scope.logout();
	});
      }).
      error( function(rt,et) {
        alert("Error listing nicknames on server. "+et);
      })
    ;

    // in case this takes too long
    setTimeout(function() { $scope.$apply(function() { $scope.listAllPeersStatus=false; }); }, PEERJS_TIMEOUT);
  };

  $scope.updateNickName=function() {
    $scope.nickName.old=$scope.nickName.val;

    if(!$scope.isUnconnectedToAnyone()) {
      wia=$scope.whoIsAdmin();
      if(wia==$scope.id) {
         // change nickname and broadcast
         $scope.nicks[wia]=$scope.nickName.val;
         $scope.broadcastListResponse();
      } else {
         // disconnect and reconnect with new nickname
         $scope.closePeer(wia);
         $scope.connectOut(wia);
      }
    }

    // post nickname to bulletin board on dynamodb server
    $scope.nickName.warning="";
    $scope.nickName.error="";
    $http.post(
        YOLOBEAR_SERVER_URL+'/putNick.php',
        { peerId:$scope.id,
          nick:$scope.nickName.val,
          pwd:$scope.nickName.pwd
        }
      ).
      success( function(rt) {
        if(rt.error) {
          $scope.nickName.error=rt.error;
          return;
        }
        if(rt.warning) {
          $scope.nickName.warning=rt.warning;
          return;
        }
      }).
      error( function(rt,et) {
        alert("Error posting nickname to server. "+et);
      })
    ;

    // if registered email included
    if($scope.regist.loggedIn) {
      $scope.putEmail();
    }

  };

  $scope.putEmail=function(useEmptyPeerId) {
      $scope.regist.inProgress=true;
      $scope.regist.warning="";
      $scope.regist.error="";
      $http.post(
        YOLOBEAR_SERVER_URL+'/putEmail.php',
        { email0:$scope.regist.email0,
          pwd:$scope.regist.pwd,
          nick:$scope.nickName.val,
          peerId:(useEmptyPeerId?"":$scope.id),
          metaD:$scope.regist.metaD
        }
      ).
      success( function(rt) {
        if(rt.error) {
          $scope.regist.error=rt.error;
          $scope.regist.inProgress=false;
          return;
        }
        if(rt.warning) {
          $scope.regist.warning=rt.warning;
          $scope.regist.inProgress=false;
          return;
        }
        $scope.regist.inProgress=false;
      }).
      error( function(rt,et) {
        $scope.regist.inProgress=false;
        alert("Error registering/updating email to server. "+et);
      });
  };

  $scope.getEmail=function() {
      $scope.regist.inProgress=true;
      $scope.regist.warning="";
      $scope.regist.error="";
      $http.post(
        YOLOBEAR_SERVER_URL+'/getEmail.php',
        { email0:$scope.regist.email0,
          pwd:$scope.regist.pwd
        }
      ).
      success( function(rt) {
        if(rt.error) {
          $scope.regist.error=rt.error;
          $scope.regist.inProgress=false;
          return;
        }
        if(rt.warning) {
          $scope.regist.warning=rt.warning;
          $scope.regist.inProgress=false;
          return;
        }
        $scope.regist.loggedIn=true;
        $scope.regist.inProgress=false;
        //$('#backBtn4').click();
        $('#LoginDiv1').show();
        $('#backBtn2Div').show();
        $('#LoginDiv2').hide();
        $('#backBtn4Div').hide();
        //$('#backBtn2').click();
        $('#tournamentDiv').show();
        $('#LoginDiv1').hide();
        $('#backBtn2Div').hide();

        $scope.nickName.val=rt.nick;
        $scope.updateNickName(); // update nickname with the new nickname

	window.localStorage.setItem("regist",angular.toJson({email0:$scope.regist.email0,pwd:$scope.regist.pwd}));
      }).
      error( function(rt,et) {
        $scope.regist.inProgress=false;
        alert("Error loggin in/registering email to server. "+et);
      });
  };

  $scope.logout=function() {
      $scope.putEmail(true);
      $scope.regist.inProgress=false;
      $scope.regist.warning="";
      $scope.regist.error="";
      $scope.regist.email0="";
      $scope.regist.pwd="";
      $scope.regist.loggedIn=false;
  };

  $scope.loginForget=function() {
      if($scope.loginForgettable()) {
        $scope.logout();
        localStorage.removeItem("regist");
      }
  };

  $scope.loginForgettable=function() {
      return(localStorage.getItem("regist") !== null);
  };


  $scope.loginPre=function() {
    if(localStorage.getItem("regist") !== null) {
      temp=angular.fromJson(localStorage.getItem("regist"));
      $scope.regist.email0=temp.email0;
      $scope.regist.pwd=temp.pwd;
      //$scope.getEmail();
    }
  };

  angular.element(document).ready(function() {
    $scope.loginPre();
  });
}
