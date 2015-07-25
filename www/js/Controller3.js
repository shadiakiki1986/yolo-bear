function Controller3($scope,$http) {

  $scope.anyAjaxWorking=function() { return $http.pendingRequests.length!==0; };

  $scope.savedTournaments=[];

  lm = new ListManager($scope,$http);
  $scope.list=function() {
    if(!USE_AWS_LAMBDA) lm.nonLambda(); else lm.lambda();
  };
 
  $scope.lastLoaded=null;
  gm = new GetManager($scope,$http);
  $scope.get=function(name) {
    if(!USE_AWS_LAMBDA) gm.nonLambda(); else gm.lambda();
  };

  $scope.saveCore=function(name,pass) {
    $http({ method:'GET',
      url: YOLOBEAR_SERVER_URL+'/new.php',
      params: {tournamentName:name,tournamentPassword:pass,tournamentData:$scope.$parent.ybt}
      }).
      success( function(rt) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }
        $scope.list();
      }).
      error( function(rt,et) {
        alert("Error adding/updating tournament "+name+" on server. "+et);
      })
    ;
  };

  passRequest=function() { return prompt("Enter tournament password",""); };

  $scope.save=function(name) {
    $scope.saveCore(name,passRequest());
  };

  dm = new DelManager($scope,$http);
  $scope.del=function(name) {
    pass=passRequest();
    if(!USE_AWS_LAMBDA) dm.nonLambda(name,pass); else dm.lambda(name,pass);
  };

  $scope.astl=null;

  $scope.$on('requestDataBroadcast',function(event,ybt) { if($scope.astl!=null) $scope.saveCore($scope.astl.name,$scope.astl.pass); });

  $scope.autosaveSet=function(name) {
    pass=passRequest();
    $scope.astl={name:name,pass:pass};
    $scope.sctn=name;
    $scope.sctp=pass;
  };
  $scope.autosaveRemove=function() {
    $scope.astl=null;
    $scope.sctn="";
    $scope.sctp="";
  };

  angular.element(document).ready(function() {
    $scope.list();
  });

}
