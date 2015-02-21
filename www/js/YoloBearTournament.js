function YoloBearTournament() {

this.players=[];
this.teams=[];
this.games=[];
this.statNames=["Score","Assists","Rebounds","Steals","Blockshots"];

this.newId=function(aaa) {
  return aaa.map(function(x) { return x.id; }).reduce(function(a,b) { return Math.max(a,b)+1; },0);
};

this.addPlayer=function(n,tid) {
  // init
  nybp=new YoloBearPlayer({
    id:this.newId(this.players),
    name:n,
    teamId:tid,
    gameStats:[]
  }, this);
  // if this player's team is already playing any games, then the stats should be added here
  this.games.filter(function(x) { return (x.team1Id==tid||x.team2Id==tid); }).map(function(x) { return nybp.addGameStats(x.id); });
  // add
  this.players.push(nybp);
  this.players.sort(comparePlayers);
};

this.addTeam=function(n) {
  this.teams.push(new YoloBearTeam({
    id: this.newId(this.teams),
    name:n
  },this));
  this.teams.sort(compareTeams);
};

this.addGame=function(t1id,t2id) {
  // make a copy of the players ... to be augmented with scores
  var gid=this.newId(this.games);
  this.teamById(t1id)
    .players()
    .concat(this.teamById(t2id).players())
    .map(function(x) { return x.addGameStats(gid); })
  ;

  // swap if needed
  if(this.teamById(t1id).name>this.teamById(t2id).name) {
     temp=t1id;
     t1id=t2id;
     t2id=temp;
  }

  this.games.push(new YoloBearGame({
    id:gid,
    team1Id:t1id,
    team2Id:t2id,
    state: "Waiting",
  },this));

  this.games.sort(compareGames);
};

this.teamFilterId=function(tid) { return this.teams.filter(function(x) { return (x.id==tid); }); };
this.teamIdExists=function(tid) { return this.teamFilterId(tid).length>0; };
this.teamById=function(tid) {
    tfi=this.teamFilterId(tid);
    if(tfi.length==0) return null;
    return tfi[0];
};

this.nGamesState=function(st) {
  return this.games.filter(function(x) { return (x.state==st); }).length;
};

  this.gamesByState=function(st) { return this.games.filter(function(x) { return (x.state==st); }); };


  this.delTeam=function(tid) {
    if(this.teamById(tid).players().length>0) {
       alert("Please delete the players on this team before deleting the team.");
    } else {
       if(this.games.filter(function(x) { return (x.team1Id==tid||x.team2Id==tid); }).length>0) {
          alert("Please delete the games played by this teams before deleting the team");
       } else {
          this.teams=this.teams.filter(function(x) { return (x.id!=tid); });
       }
    }
  };
  this.delPlayer=function(pid) { this.players=this.players.filter(function(x) { return (x.id!=pid); }); };
  this.delGame=function(gid) {
     this.games=this.games.filter(function(x) { return (x.id!=gid); });
     this.players.map(function(x) { return (x.gameStats=x.gameStats.filter(function(y) { return y.gid!=gid; })); });
  };


}
