function Controller3($scope,$http) {

  $scope.anyAjaxWorking=function() { return $http.pendingRequests.length!==0; };

  $scope.savedTournaments=[];

  $scope.list=function() {
    $http.get(YOLOBEAR_SERVER_URL+'/list.php').
      success( function(rt) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }
        $scope.savedTournaments=angular.fromJson(rt).sort();
        $scope.$parent.savedTournamentsServerN=$scope.savedTournaments.length;
      }).
      error( function(rt,et) {
        alert("Error listing tournaments on server. "+et);
      })
    ;
  };
 
  $scope.lastLoaded=null;
  $scope.get=function(name) {
    $http({ method:'GET',
      url: YOLOBEAR_SERVER_URL+'/get.php',
      params: {tournamentName:name}
      }).
      success( function(rt) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }
        $scope.$emit('responseDataBroadcast',angular.fromJson(rt).tournamentData);
        $scope.lastLoaded=name;
        $scope.$parent.isLocal=false;
      }).
      error( function(rt,et) {
        alert("Error getting tournament "+name+" from server. "+et);
      })
    ;
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

  $scope.del=function(name) {
    pass=passRequest();
    $http({ method:'GET',
      url: YOLOBEAR_SERVER_URL+'/del.php',
      params: {tournamentName:name,tournamentPassword:pass}
      }).
      success(function(rt) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }
        $scope.list();
      }).
      error(function(rt,et) {
        alert("Error deleting tournament "+name+" from server. "+rt+"."+et);
      })
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
