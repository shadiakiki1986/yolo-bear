var NewManager = function($scope,$http) {

  this.nonLambda=function(name,pass,cbFn) {
    var self = this;
    $http(
      { method:'GET',
        url: YOLOBEAR_SERVER_URL+'/new.php',
        params: {
          tournamentName:name,
          tournamentPassword:pass,
          tournamentData:angular.fromJson(angular.toJson($scope.$parent.ybt)) // to drop angular fields
        }
      }).
      success( function(rt) { self.success(rt,cbFn); self.complete(); } ).
      error( this.error )
    ;
  };

  this.lambda = function(name,pass,cbFn) {
    var self=this;
    $scope.$parent.awsMan.invokeLambda(
      "yolo-bear-new",
      { tournamentName:name,
        tournamentPassword:pass,
        tournamentData:angular.fromJson(angular.toJson($scope.$parent.ybt)) // to drop angular fields
      }, // event
      function(err,data) {
        if (err||data.StatusCode!=200) {
          self.error(null,err);
          return;
        }

        rt=angular.fromJson(data.Payload);
        if(rt.hasOwnProperty("errorMessage")) {
          rt = { error: rt.errorMessage };
        }

        $scope.$apply(function() {
          self.success(rt,cbFn);
          self.complete();
        });
    });
  };

  this.success = function(rt,cbFn) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }
        $scope.list();
        if(typeof cbFn!=='undefined') cbFn();
  };

  this.error = function(rt,et) {
        alert("Error adding/updating tournament on server. "+et);
        this.complete();
  };

  this.complete = function() {
        $scope.asp=false;
  };

} // end class
