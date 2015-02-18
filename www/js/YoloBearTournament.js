function YoloBearTournament() {

this.players=[];
this.teams=[];
this.games=[];
this.statNames=["Score","Assists","Rebounds","Steals","Blockshots"];

this.addPlayer=function(n,tid) {

  this.players.push(new YoloBearPlayer({
    id:this.players.length,
    name:n,
    teamId:tid,
    gameStats:[]
  }, this));
};

this.addTeam=function(n) {
  this.teams.push(new YoloBearTeam({
    id: this.teams.length,
    name:n
  },this));
};

this.addGame=function(t1id,t2id) {
  // make a copy of the players ... to be augmented with scores
  var gid=this.games.length;
  this.teams[t1id]
    .players()
    .concat(this.teams[t2id].players())
    .map(function(x) { return x.addGameStats(gid); })
  ;

  this.games.push(new YoloBearGame({
    id:gid,
    team1Id:t1id,
    team2Id:t2id,
    state: "Waiting",
  },this));
};



}
