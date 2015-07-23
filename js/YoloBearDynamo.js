function YoloBearDynamo($scope,$http) {
  
  $scope.regist={
    email0:null,
    pwd:null,
    //nick:"", // get this from $scope.$parent.nickName.val
    peerId:"",
    metaD:"",
    warning:"",
    error:"",
    loggedIn:false,
    inProgress:false,
    saved:{}
  };

  $scope.nickName2={
    warning:"",
    error:""
  };

  $scope.listNick=function() {
    // get list of nicknames on server
    $http.get(YOLOBEAR_SERVER_URL+'/listNick.php').
      success( function(rt) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }

        Object.keys(rt).map(function(x) {
		//if(rt[x].nick && rt[x].email0) {
                $scope.$emit("setNick",x,{val:rt[x].nick,email:rt[x].email0});

		// if found other nickname with registered email as mine, I must have been logged out
		if(rt[x].email0==$scope.regist.email0 && $scope.regist.loggedIn && x!=$scope.id) {
			console.log("Looks like I've been logged out by "+x);
			$scope.logout();
		}
	});

      }).
      error( function(rt,et) {
        alert("Error listing nicknames on server. "+et);
      });
  };
  $scope.$on('listNick',function() { $scope.listNick(); });

  $scope.putNick=function() {
    // post nickname to bulletin board on dynamodb server
    $scope.nickName2.warning="";
    $scope.nickName2.error="";
    $http.post(
        YOLOBEAR_SERVER_URL+'/putNick.php',
        { peerId:$scope.id,
          nick:$scope.$parent.nickName.val,
          pwd:$scope.$parent.nickName.pwd
        }
      ).
      success( function(rt) {
        if(rt.error) {
          $scope.nickName2.error=rt.error;
          return;
        }
        if(rt.warning) {
          $scope.nickName2.warning=rt.warning;
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
  $scope.$on('putNick',function() { $scope.putNick(); });

  $scope.putEmail=function(useEmptyPeerId) {
      $scope.regist.inProgress=true;
      $scope.regist.warning="";
      $scope.regist.error="";
console.log("putEmail",$scope.regist.metaD);
      $http.post(
        YOLOBEAR_SERVER_URL+'/putEmail.php',
        { email0:$scope.regist.email0,
          pwd:$scope.regist.pwd,
          nick:$scope.$parent.nickName.val,
          peerId:(useEmptyPeerId?"":$scope.id),
          metaD:angular.toJson($scope.regist.metaD)
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

        $scope.$parent.nickName.val=rt.nick;
        $scope.$parent.nickName.email=$scope.regist.email0;
        $scope.updateNickName(); // update nickname with the new nickname

        // save to local storage
        $scope.regist.saved[$scope.regist.email0]={email0:$scope.regist.email0,pwd:$scope.regist.pwd};
	window.localStorage.setItem("regist",angular.toJson($scope.regist.saved));

        // process meta-data
        $scope.regist.metaD=angular.fromJson(rt.metaD);
console.log("metadata",$scope.regist.metaD);
        if(!$scope.regist.metaD) $scope.regist.metaD={};
        if(!$scope.regist.metaD.hasOwnProperty('network')) $scope.regist.metaD={network:[]};

        // announce the list of trusted nicksPlusEmails from the metadata
        if($scope.regist.metaD.network.length>0) {
           $scope.$emit('getEmailNetwork',$scope.regist.metaD.network);
        }

      }).
      error( function(rt,et) {
        $scope.regist.inProgress=false;
        alert("Error loggin in/registering email to server. "+et);
      });
  };

  $scope.logout=function(useEmptyPeerId) {
    if($scope.regist.loggedIn) {
      if(useEmptyPeerId) $scope.putEmail(true);
      $scope.regist.inProgress=false;
      $scope.regist.warning="";
      $scope.regist.error="";
      $scope.regist.email0="";
      $scope.regist.pwd="";
      $scope.regist.loggedIn=false;
    }
  };

  $scope.loginForget=function() {
      if($scope.loginForgettable()) {
        $scope.logout(true);
        localStorage.removeItem("regist");
        $scope.regist.saved={};
      }
  };

  $scope.loginForgettable=function() {
      return(localStorage.getItem("regist") !== null);
  };


  $scope.loginPre=function() {
    if(localStorage.getItem("regist") !== null) {
      $scope.regist.saved=angular.fromJson(localStorage.getItem("regist"));
      //$scope.getEmail();
    }
  };

  $scope.addToTrustedNetwork=function(email) {
    if($scope.regist.loggedIn && $scope.regist.metaD.network.indexOf(email)==-1 && email!='') {
      $scope.regist.metaD.network.push(email);
      // useless // $scope.regist.metaD.network=$scope.regist.metaD.network.unique();
      $scope.putEmail(); // update to dynamo table
    }
  };

  $scope.removeFromTrustedNetwork=function(email) {
    if($scope.regist.loggedIn && $scope.regist.metaD.network.indexOf(email)!=-1 && email!='') {
      $scope.regist.metaD.network=$scope.regist.metaD.network.diff(email);
      // useless // $scope.regist.metaD.network=$scope.regist.metaD.network.unique();
      $scope.putEmail(); // update to dynamo table
    }
  };


  $scope.peersSorted=function() { return $scope.$parent.peers().sort(function(a,b) { return comparePeers(a,b,$scope.regist,$scope.$parent.nicks); }); };

  $scope.loginForgot=function() {
      $http.post(
        YOLOBEAR_SERVER_URL+'/forgotPassword.php',
        { email0:$scope.regist.email0 }
      ).
      success( function(rt) {
        if(rt.error) {
          console.log(rt.error);
          return;
        }
        if(rt.warning) {
          console.log(rt.warning);
          return;
        }
        alert("An email has been sent to "+$scope.regist.email0+" with the password. Please check there (including the junk folder)");
      }).
      error( function(rt,et) {
        alert("Error emailing forgotten password. "+et);
      });
  };


}
