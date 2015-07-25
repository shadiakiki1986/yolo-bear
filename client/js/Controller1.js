function Controller1($scope) {

$scope.awsMan = null;

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
$scope.delTeam=function(tid) {
   $scope.ybt.delTeam(tid);
   requestDataBroadcast();
};
$scope.delPlayer=function(pid) {
   $scope.ybt.delPlayer(pid);
   requestDataBroadcast();
};
$scope.delGame=function(gid) {
   $scope.ybt.delGame(gid);
   requestDataBroadcast();
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
  requestDataBroadcast();
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

  $scope.assignAdmin1=function(id) { $scope.$broadcast("assignAdmin1",id); };
  $scope.assignAdmin2=function(id) { $scope.$broadcast("assignAdmin2",id); };

  $scope.decideBroadcast=function() {
    $scope.$broadcast("decideBroadcast");
  };

  $scope.autosaveIsOn=false;
  $scope.savedTournamentsLocalN=0;
  $scope.savedTournamentsServerN=0;

  $scope.newTournamentCan=function() { return $scope.ybt.teams.length>0||$scope.ybt.players.length>0||$scope.ybt.games.length>0; };
  $scope.newTournamentLoad=function() {
    $scope.ybt=new YoloBearTournament();
    $scope.requestDataBroadcast();
  };

  $scope.isLocal=false;

  angular.element(document).ready(function() {
    // cognito role
    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:639fd2a8-8277-4726-b9b3-3231ed0d5f71',
    });
    // note that this is only the timeout for making a connection.
    // The timeout for the tokens is by default 15 minutes, as documented here under TokenDuration
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html
    // That is why I run a setTimeout in AwsManager to change the connection status to disconnected 15 minutes after the initial connection
    AWS.config.httpOptions = { timeout: 5000 };

    $scope.awsMan = new AwsManager();
  });

}
