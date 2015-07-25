var GetManager = function($scope,$http) {

  this.nonLambda=function(name) {
    $http({ method:'GET',
      url: YOLOBEAR_SERVER_URL+'/get.php',
      params: {tournamentName:name}
      }).
      success( this.success ).
      error( this.error )
    ;
  };

  this.success = function(rt) {
    if(rt.error) {
      alert("Error: "+rt.error);
      return;
    }
    $scope.$emit('responseDataBroadcast',angular.fromJson(rt).tournamentData);
    $scope.lastLoaded=name;
    $scope.$parent.isLocal=false;
  };

  this.error = function(rt,et) {
    alert("Error getting tournament "+name+" from server. "+et);
  };

} // end class
