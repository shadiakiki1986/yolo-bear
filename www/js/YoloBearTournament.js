function YoloBearTournament() {

this.players=[];
this.teams=[];
this.games=[];
this.statNames=["Score","Assists","Rebounds","Steals","Blockshots"];

this.addPlayer=function(n,tid) {
  this.players.push({
    id:this.players.length,
    name:n,
    team:this.teams[tid],
    gameStats: [],
    addGameStats: function() {
      gsid=this.gameStats.length;
      this.gameStats.push({
        playerId: this.id,
        playerName: this.name,
        playerTeam: this.team,
        Score:0, Assists:0, Rebounds:0,
        Steals:0, Blockshots:0
      });
      return this.gameStats[gsid];
    }
  });
};

this.addTeam=function(n) {
  var self=this;
  var tid=this.teams.length;
  this.teams.push({
    id:tid,
    name:n,
    players: function() {
      return self.players
          .filter(function(x) { return x.team.id==tid; })
      ;
    },
    playersNames:function() {
      return this.players()
          .map(function(x) { return x.name; }).join()
      ;
    },
    games: function() {
      return self.games
        .filter(function(x) { return x.state=="Done"; })
        .filter(function(x) { return x.team1.id==tid || x.team2.id==tid; });
    },
    gamesWon:function() {
      return this.games().filter(function(x) {
            t1s=x.teamScore(x.team1.id);
            t2s=x.teamScore(x.team2.id);
            return ( x.team1.id==tid && t1s>t2s ) || ( x.team2.id==tid && t2s>t1s );
        }).length;
    },
    gamesLost:function() {
      return this.games().filter(function(x) {
            t1s=x.teamScore(x.team1.id);
            t2s=x.teamScore(x.team2.id);
            return ( x.team1.id==tid && t1s<t2s ) || ( x.team2.id==tid && t2s<t1s );
        }).length;
    },
    gamesTied:function() {
      return this.games().filter(function(x) {
            t1s=x.teamScore(x.team1.id);
            t2s=x.teamScore(x.team2.id);
            return ( x.team1.id==tid || x.team2.id==tid ) && t2s==t1s;
        }).length;
    }

  });
};

this.addGame=function(t1id,t2id) {
  // make a copy of the players ... to be augmented with scores
  var plgs=this.teams[t1id]
    .players()
    .concat(this.teams[t2id].players())
    .map(function(x) { return x.addGameStats(); })
  ;

  this.games.push({
    id:this.games.length,
    team1:this.teams[t1id],team2:this.teams[t2id],
    teamScore: function(txid) {
       return this.playerStats
         .filter(function(x) { return x.playerTeam.id==txid; })
         .map(function(x) { return x.Score; })
         .reduce(function(a,b) { return a+b; });
    },
    state: "Waiting",
    playerStats: plgs,
    playerStatsById: function(id) {
      return this.playerStats.filter(function(x) { return x.playerId==id; });
    },
    setPlayerScore: function(pid,statName,statValue) {
       var psid=this.playerStatsById(pid);
       if(psid.length>0) this.playerStatsById(pid)[0][statName]=statValue;
    }
  });
};


}
