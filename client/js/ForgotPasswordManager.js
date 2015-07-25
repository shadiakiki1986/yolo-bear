var ForgotPasswordManager = function($scope,$http) {

  this.nonLambda=function() {
      $http.post(
        YOLOBEAR_SERVER_URL+'/forgotPassword.php',
        { email0:$scope.regist.email0 }
      ).
      success( this.success ).
      error( this.error );
  };

  this.lambda = function() {
    var self=this;
    $scope.$parent.$parent.awsMan.invokeLambda(
      "yolo-bear-forgotPassword",
      {email0:$scope.regist.email0}, // event
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
          console.log(rt.error);
          return;
        }
        if(rt.warning) {
          console.log(rt.warning);
          return;
        }
        alert("An email has been sent to "+$scope.regist.email0+" with the password. Please check there (including the junk folder)");
  };

  this.error = function(rt,et) {
        alert("Error emailing forgotten password. "+et);
  };

} // end class
