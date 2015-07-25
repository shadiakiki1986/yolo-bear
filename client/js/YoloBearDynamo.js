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

  lnm = new ListNickManager($scope,$http);
  $scope.listNick=function() {
    // get list of nicknames on server
    if(!USE_AWS_LAMBDA) lnm.nonLambda(); else lnm.lambda();
  };
  $scope.$on('listNick',function() { $scope.listNick(); });

  pnm = new PutNickManager($scope,$http);
  $scope.putNick=function() {
    // post nickname to bulletin board on dynamodb server
    $scope.nickName2.warning="";
    $scope.nickName2.error="";

    // if registered email included
    if($scope.regist.loggedIn) {
      $scope.putEmail(); // this will implicitly run a put nick on the server
    } else {
      if(!USE_AWS_LAMBDA) pnm.nonLambda(); else pnm.lambda();
    }

  };
  $scope.$on('putNick',function() { $scope.putNick(); });

  pem = new PutEmailManager($scope,$http);
  $scope.putEmail=function(useEmptyPeerId) {
      $scope.regist.inProgress=true;
      $scope.regist.warning="";
      $scope.regist.error="";
      console.log("putEmail",$scope.regist.metaD);
      if(!USE_AWS_LAMBDA) pem.nonLambda(useEmptyPeerId); else pem.lambda(useEmptyPeerId);
  };

  gem = new GetEmailManager($scope,$http);
  $scope.getEmail=function() {
      $scope.regist.inProgress=true;
      $scope.regist.warning="";
      $scope.regist.error="";
      if(!USE_AWS_LAMBDA) gem.nonLambda(); else gem.lambda();
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

  fpm = new ForgotPasswordManager($scope,$http);
  $scope.loginForgot=function() {
      if(!USE_AWS_LAMBDA) fpm.nonLambda(); else fpm.lambda();
  };


}
