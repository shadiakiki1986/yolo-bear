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
