var PutEmailManager = function($scope,$http) {

  this.nonLambda=function(useEmptyPeerId) {
      $http.post(
        YOLOBEAR_SERVER_URL+'/putEmail.php',
        { email0:$scope.regist.email0,
          pwd:$scope.regist.pwd,
          nick:$scope.$parent.nickName.val,
          peerId:(useEmptyPeerId?"":$scope.id),
          metaD:angular.toJson($scope.regist.metaD)
        }
      ).
      success( this.success ).
      error( this.error );
  };

  this.lambda = function(useEmptyPeerId) {
    var self=this;
    $scope.$parent.$parent.awsMan.invokeLambda(
      "yolo-bear-putEmail",
      { email0:$scope.regist.email0,
        pwd:$scope.regist.pwd,
        nick:$scope.$parent.nickName.val,
        peerId:(useEmptyPeerId?"":$scope.id),
        metaD:angular.toJson($scope.regist.metaD)
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
        $scope.$apply(function() { self.success(rt); });
    }); 
  };

  this.success = function(rt) {
        if(rt.error) {
          $scope.regist.error=rt.error;
          $scope.regist.inProgress=false;
          return;
        }
        if(rt.warning) {
          $scope.regist.warning=rt.warning;
          $scope.regist.inProgress=false;
          return;
        }
        $scope.regist.inProgress=false;
  };

  this.error = function(rt,et) {
        $scope.regist.inProgress=false;
        alert("Error registering/updating email to server. "+et);
  };

} // end class
