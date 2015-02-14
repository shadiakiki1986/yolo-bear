function YoloBearTournament() {

this.players=[];
this.teams=[];
this.games=[];

this.addPlayer=function(n,tid) {
  this.players.push({
    id:this.players.length,
    name:n,
    team:this.teams[tid].name,
    teamId:tid
  });
};

this.addTeam=function(n) {
  this.teams.push({id:this.teams.length,name:n});
};

this.addGame=function(t1id,t2id) {
  this.games.push({
    id:this.games.length,
    team1:this.teams[t1id].name,team2:this.teams[t2id].name,
    team1Id:t1id,team2Id:t2id,
    team1Score: 0, team2Score: 0
  });
};

this.setGameScore=function(gid,t1s,t2s) {
   this.games[gid].team1Score=t1s;
   this.games[gid].team2Score=t2s;
};


}
