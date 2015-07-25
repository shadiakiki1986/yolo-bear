var ListManager = function($scope,$http) {

  this.nonLambda=function() {
    $http.get(YOLOBEAR_SERVER_URL+'/list.php').
      success( this.success ).
      error( this.error )
    ;
  };

  this.lambda = function() {
    var self=this;
    $scope.$parent.awsMan.invokeLambda(
      "yolo-bear-list",
      {}, // event
      function(err,data) {
        if (err||data.StatusCode!=200) {
          self.error(null,err);
          return;
        }
        rt=angular.fromJson(data.Payload);
        if(rt.hasOwnProperty("errorMessage")) {
          rt = { error: rt.errorMessage };
        }
        $scope.$apply(function() { self.success(rt); });
    }); 
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
