function Controller2($scope) {

  savedTournamentsLocalCore=function() {
    stlc=window.localStorage.getItem("savedTournamentsLocal");
    if(stlc==null) return []; else return angular.fromJson(stlc);
  };

  $scope.savedTournamentsLocal=function() {
    stlc=savedTournamentsLocalCore();
    $scope.$parent.savedTournamentsLocalN=stlc.length;
    return stlc.map(function(x) { return x.name; }).sort();
  };
  
  loadTournamentLocalCore=function(name) { return savedTournamentsLocalCore().filter(function(x) { return x.name==name; }); };

  $scope.loadTournamentLocal=function(name) {
    stl=loadTournamentLocalCore(name);
    if(stl.length==0) {
      alert("No such tournament");
      return;
    }

    $scope.$emit('responseDataBroadcast',stl[0].ybt);
  };

  $scope.saveTournamentLocal=function(name) {
    ow=true;
    if(loadTournamentLocalCore(name).length>0 && !$scope.astl && $scope.sct) ow=confirm("This tournament name already exists. Do you want to overwrite it?");
    if(ow) {
      stlc=savedTournamentsLocalCore();
      stlc=stlc.filter(function(x) { return x.name!=name; });
      stlc.push({name:name,ybt:$scope.$parent.ybt});
      window.localStorage.setItem("savedTournamentsLocal",angular.toJson(stlc));
      if(!$scope.astl & !$scope.sct) alert("Tournament saved");
    }
  };

  $scope.delTournamentLocal=function(name) {
      stlc=savedTournamentsLocalCore();
      stlc=stlc.filter(function(x) { return x.name!=name; });
      window.localStorage.setItem("savedTournamentsLocal",angular.toJson(stlc));
  };

  $scope.astl=null;

  $scope.$on('requestDataBroadcast',function(event,ybt) { if($scope.astl!=null) $scope.saveTournamentLocal($scope.astl); });
  $scope.autosaveSet=function(name) {
    $scope.astl=name;
    $scope.sct=name;
    $scope.$parent.autosaveIsOn=$scope.astl;
  };
  $scope.autosaveRemove=function() {
    $scope.astl=null;
    $scope.sct="";
    $scope.$parent.autosaveIsOn=null;
  };

  $scope.isSameAsTournament=function(name) { return angular.toJson(loadTournamentLocalCore(name)[0].ybt)==angular.toJson($scope.$parent.ybt); };


}
