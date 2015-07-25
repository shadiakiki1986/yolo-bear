var PutNickManager = function($scope,$http) {

  this.nonLambda=function() {
    // post nickname to bulletin board on dynamodb server
    $http.post(
        YOLOBEAR_SERVER_URL+'/putNick.php',
        { peerId:$scope.id,
          nick:$scope.$parent.nickName.val,
          pwd:$scope.$parent.nickName.pwd
        }
      ).
      success( this.success ).
      error( this.error )
    ;
  };

  this.success = function(rt) {
        if(rt.error) {
          $scope.nickName2.error=rt.error;
          return;
        }
        if(rt.warning) {
          $scope.nickName2.warning=rt.warning;
          return;
        }
  };

  this.error = function(rt,et) {
        alert("Error posting nickname to server. "+et);
  };

} // end class
