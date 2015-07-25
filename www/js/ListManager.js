var ListManager = function($scope,$http) {

  this.nonLambda=function() {
    $http.get(YOLOBEAR_SERVER_URL+'/list.php').
      success( this.success ).
      error( this.error )
    ;
  };

  this.success = function(rt) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }
        $scope.savedTournaments=angular.fromJson(rt).sort();
        $scope.$parent.savedTournamentsServerN=$scope.savedTournaments.length;
  };

  this.error = function(rt,et) {
        alert("Error listing tournaments on server. "+et);
  };

} // end class
