var GetEmailManager = function($scope,$http) {

  this.nonLambda=function() {
      $http.post(
        YOLOBEAR_SERVER_URL+'/getEmail.php',
        { email0:$scope.regist.email0,
          pwd:$scope.regist.pwd
        }
      ).
      success( this.success ).
      error( this.error );
  };

  this.lambda = function() {
    var self=this;
    $scope.$parent.$parent.awsMan.invokeLambda(
      "yolo-bear-getEmail",
      { email0:$scope.regist.email0,
        pwd:$scope.regist.pwd
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
        $scope.regist.loggedIn=true;
        $scope.regist.inProgress=false;
        //$('#backBtn4').click();
        $('#LoginDiv1').show();
        $('#backBtn2Div').show();
        $('#LoginDiv2').hide();
        $('#backBtn4Div').hide();
        //$('#backBtn2').click();
        $('#tournamentDiv').show();
        $('#LoginDiv1').hide();
        $('#backBtn2Div').hide();

        $scope.$parent.nickName.val=rt.nick;
        $scope.$parent.nickName.email=$scope.regist.email0;
        $scope.updateNickName(); // update nickname with the new nickname

        // save to local storage
        $scope.regist.saved[$scope.regist.email0]={email0:$scope.regist.email0,pwd:$scope.regist.pwd};
        window.localStorage.setItem("regist",angular.toJson($scope.regist.saved));

        // process meta-data
        $scope.regist.metaD=angular.fromJson(rt.metaD);
console.log("metadata",$scope.regist.metaD);
        if(!$scope.regist.metaD) $scope.regist.metaD={};
        if(!$scope.regist.metaD.hasOwnProperty('network')) $scope.regist.metaD={network:[]};

        // announce the list of trusted nicksPlusEmails from the metadata
        if($scope.regist.metaD.network.length>0) {
           $scope.$emit('getEmailNetwork',$scope.regist.metaD.network);
        }
  };

  this.error = function(rt,et) {
        $scope.regist.inProgress=false;
        alert("Error loggin in/registering email to server. "+et);
  };

} // end class
