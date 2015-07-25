var DelManager = function($scope,$http) {

  this.nonLambda=function(name,pass) {
    $http({ method:'GET',
      url: YOLOBEAR_SERVER_URL+'/del.php',
      params: {tournamentName:name,tournamentPassword:pass}
      }).
      success(this.success).
      error(this.error)
    ;
  };

  this.lambda = function(name,pass) {
    var self=this;
    $scope.$parent.awsMan.invokeLambda(
      "yolo-bear-del",
      {tournamentName:name,tournamentPassword:pass}, // event
      function(err,data) {
        if (err||data.StatusCode!=200) {
          self.error(null,err);
          return;
        }
        rt=angular.fromJson(data.Payload);
        if(rt.hasOwnProperty("errorMessage")) {
          rt = { error: rt.errorMessage };
        }
        self.success(rt);
    }); 
  };

  this.success = function(rt) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }
        $scope.list();
  };

  this.error = function(rt,et) {
        alert("Error deleting tournament from server. "+rt+"."+et);
  };

} // end class
