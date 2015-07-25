var GetManager = function($scope,$http) {

  this.nonLambda=function(name) {
    var self = this;
    $http({ method:'GET',
      url: YOLOBEAR_SERVER_URL+'/get.php',
      params: {tournamentName:name}
      }).
      success( function(rt) { self.success(rt,name); } ).
      error( this.error )
    ;
  };

  this.lambda = function(name) {
    var self=this;
    $scope.$parent.awsMan.invokeLambda(
      "yolo-bear-get",
      {tournamentName:name}, // event
      function(err,data) {
        if (err||data.StatusCode!=200) {
          self.error(null,err);
          return;
        }
        rt=angular.fromJson(data.Payload);
        if(rt.hasOwnProperty("errorMessage")) {
          rt = { error: rt.errorMessage };
        }
        $scope.$apply(function() { self.success(rt,name); });
    }); 
  };

  this.success = function(rt,name) {
    if(rt.error) {
      alert("Error: "+rt.error);
      return;
    }
    $scope.$emit('responseDataBroadcast',angular.fromJson(rt).tournamentData);
    $scope.lastLoaded=name;
    $scope.$parent.isLocal=false;
  };

  this.error = function(rt,et) {
    alert("Error getting tournament from server. "+et);
  };

} // end class
