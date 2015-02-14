function Controller1($scope) {
$scope.ybt=new YoloBearTournament();
$scope.addPlayer=function() { $scope.ybt.addPlayer($scope.newPlayer.name,$scope.newPlayer.team); requestDataBroadcast(); };
$scope.addTeam=function() { $scope.ybt.addTeam($scope.newTeam.name); requestDataBroadcast(); };
$scope.addGame=function() { $scope.ybt.addGame($scope.newGame.team1,$scope.newGame.team2); requestDataBroadcast(); };
$scope.teamPlayers=function(tid) {
  return $scope.ybt.players
    .filter(function(x) { return x.teamId==tid; })
    .map(function(x) { return x.name; })
    .join();
}
$scope.setGameScore=function(a,b,c) { $scope.ybt.setGameScore(a,b,c); requestDataBroadcast(); }

requestDataBroadcast=function() { $scope.$emit("requestDataBroadcast",angular.toJson($scope.ybt)); };
$scope.$on('responseDataBroadcast',function(event,ybt) {
  temp=angular.fromJson(ybt);
  $scope.ybt.players=temp.players;
  $scope.ybt.teams=temp.teams;
  $scope.ybt.games=temp.games;
});

}
