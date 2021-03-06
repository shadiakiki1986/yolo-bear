var ListNickManager = function($scope,$http) {

  this.nonLambda=function() {
    // get list of nicknames on server
    $http.get(YOLOBEAR_SERVER_URL+'/listNick.php').
      success( this.success ).
      error( this.error );
  };

  this.lambda = function() {
    var self=this;
    $scope.$parent.$parent.awsMan.invokeLambda(
      "yolo-bear-listNick",
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

        Object.keys(rt).map(function(x) {
                //if(rt[x].nick && rt[x].email0) {
                $scope.$emit("setNick",x,{val:rt[x].nick,email:rt[x].email0});

                // if found other nickname with registered email as mine, I must have been logged out
                if(rt[x].email0==$scope.regist.email0 && $scope.regist.loggedIn && x!=$scope.id) {
                        console.log("Looks like I've been logged out by "+x);
                        $scope.logout();
                }
        });
  };

  this.error = function(rt,et) {
        alert("Error listing nicknames on server. "+et);
  };

} // end class
