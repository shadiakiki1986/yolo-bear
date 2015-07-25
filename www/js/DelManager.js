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

  this.success = function(rt) {
        if(rt.error) {
          alert("Error: "+rt.error);
          return;
        }
        $scope.list();
  };

  this.error = function(rt,et) {
        alert("Error deleting tournament "+name+" from server. "+rt+"."+et);
  };

} // end class
