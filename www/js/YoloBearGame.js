function YoloBearGame(params,ybt) {

this.id=params.id;
this.team1Id=params.team1Id;
this.team2Id=params.team2Id;
this.state=params.state;
var self=this;

  this.team1=function() { return ybt.teams[self.team1Id]; }
  this.team2=function() { return ybt.teams[self.team2Id]; }
  this.playerStats=function() {
    return ybt.players
      .filter(function(x) { return x.gameStats.filter(function(y) { return y.gid==self.id; }).length>0; })
      .map(function(x) { return x.gameStats.filter(function(y) { return y.gid==self.id; }); })
      .reduce(function(a,b) { return a.concat(b); },[])
    ;
  };
  this.teamStat=function(txid,statName) {
       return self.playerStats()
         .filter(function(x) { return x.playerTeam.id==txid; })
         .map(function(x) { return x[statName]; })
         .reduce(function(a,b) { return a+b; },0);
  };
  this.playerStatsById=function(id) {
      return self.playerStats().filter(function(x) { return x.playerId==id; });
  };
  this.setPlayerStat=function(pid,statName,statValue) {
       var psid=self.playerStatsById(pid);
       if(psid.length>0) self.playerStatsById(pid)[0][statName]=statValue;
  };


}
