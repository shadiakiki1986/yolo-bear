function YoloBearPlayer(params,ybt) {
// ybt: YoloBearTournament object
  var self=this;
  this.id=params.id;
  this.name=params.name;
  this.teamId=params.teamId;
  this.gameStats=params.gameStats;
  this.team=function() { return ybt.teams[self.teamId]; };
  this.addGameStats=function(gid) {
    self.gameStats.push({
      gid:gid,
      playerId: self.id,
      playerName: self.name,
      playerTeam: self.team(),
      Score:0, Assists:0, Rebounds:0,
      Steals:0, Blockshots:0
    });
  };

  this.gamesStat=function(statName) { return self.gameStats.map(x=>x[statName]).reduce(function(a,b) { return a+b; },0); };

}
