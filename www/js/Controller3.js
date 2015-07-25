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
    if(!USE_AWS_LAMBDA) gm.nonLambda(name); else gm.lambda(name);
  };

  nm = new NewManager($scope,$http);
  $scope.saveCore=function(name,pass) {
    if(pass===null) return;
    if(!USE_AWS_LAMBDA) nm.nonLambda(name,pass); else nm.lambda(name,pass);
  };

  passRequest=function() {
    pass = prompt("Enter tournament password","");
    if(pass=="") pass=null;
   // console.log("PASSREQ",pass);
    return pass;
  };

  $scope.save=function(name) {
    $scope.saveCore(name,passRequest());
  };

  dm = new DelManager($scope,$http);
  $scope.del=function(name) {
    pass=passRequest();
    if(pass===null) return;
    if(!USE_AWS_LAMBDA) dm.nonLambda(name,pass); else dm.lambda(name,pass);
  };

  $scope.astl=null;

  $scope.$on('requestDataBroadcast',function(event,ybt) { if($scope.astl!=null) $scope.saveCore($scope.astl.name,$scope.astl.pass); });

  $scope.autosaveSet=function(name) {
    pass=passRequest();
    if(pass===null) return;
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
