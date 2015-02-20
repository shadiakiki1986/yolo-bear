function Controller1($scope) {
$scope.ybt=new YoloBearTournament();
$scope.addPlayer=function() {
    $scope.ybt.addPlayer($scope.newPlayer.name,$scope.newPlayer.team);
    requestDataBroadcast();
    $scope.newPlayer={};
};
$scope.addTeam=function() {
    $scope.ybt.addTeam($scope.newTeam.name);
    requestDataBroadcast();
    $scope.newTeam.name='';
};
$scope.addGame=function() {
    $scope.ybt.addGame($scope.newGame.team1,$scope.newGame.team2);
    requestDataBroadcast();
    $scope.newGame={};
};
requestDataBroadcast =function() { $scope.$broadcast("requestDataBroadcast",angular.toJson($scope.ybt)); };
requestDataBroadcast2=function(peerId) { $scope.$broadcast("requestDataBroadcast2",angular.toJson($scope.ybt),peerId); };

$scope.requestDataBroadcast=requestDataBroadcast;
$scope.$on('responseDataBroadcast',function(event,ybt) {
  temp=angular.fromJson(ybt);
  $scope.ybt.players=[];
  for(var i=0;i<temp.players.length;i++) {
    $scope.ybt.players.push(new YoloBearPlayer(temp.players[i],$scope.ybt));
  }
  $scope.ybt.teams=[];
  for(var i=0;i<temp.teams.length;i++) {
    $scope.ybt.teams.push(new YoloBearTeam(temp.teams[i],$scope.ybt));
  }
  $scope.ybt.games=[];
  for(var i=0;i<temp.games.length;i++) {
    $scope.ybt.games.push(new YoloBearGame(temp.games[i],$scope.ybt));
  }
});
$scope.$on('gotDataRequest',function(event,peerId) { requestDataBroadcast2(peerId); });

$scope.teamLost=function(tid) {
  return $scope.ybt.games
    .filter(function(x) { return x.state=="Done" && (
        ( x.team1Id==tid && x.team1Score<x.team2Score ) ||
        ( x.team2Id==tid && x.team2Score<x.team1Score )
        );
    })
    .length;
};

$scope.teamTie=function(tid) {
  return $scope.ybt.games
    .filter(function(x) { return x.state=="Done" && (
        ( x.team1Id==tid || x.team2Id==tid  ) &&
        x.team2Score==x.team1Score
        );
    })
    .length;
};

$scope.setGamePlayerScore=function(ga,gpsid,sn,sv) {
  ga.setPlayerStat(gpsid,sn,sv);
  requestDataBroadcast();
};

    $scope.iAmAdminV = false;
    $scope.iAmAdmin = function(){
        $scope.$broadcast('amIAdmin');
        return  $scope.iAmAdminV;
    };

    $scope.showGamesState='Playing';

}
