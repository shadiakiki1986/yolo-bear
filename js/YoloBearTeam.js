function YoloBearTeam(params,ybt) {

  this.id=params.id;
  this.name=params.name;
  var self=this;

  this.players=function() {
      return ybt.players
          .filter(function(x) { return x.team().id==self.id; })
      ;
  };

  this.playersNames=function() {
      return self.players()
          .map(function(x) { return x.name; }).join()
      ;
  };

  this.gamesDone=function() {
      return ybt.games
        .filter(function(x) { return x.state=="Done"; })
        .filter(function(x) { return x.team1().id==self.id || x.team2().id==self.id; });
  };

  this.gamesWon=function() {
      return self.gamesDone().filter(function(x) {
            t1s=x.teamStat(x.team1().id,'Score');
            t2s=x.teamStat(x.team2().id,'Score');
            return ( x.team1().id==self.id && t1s>t2s ) || ( x.team2().id==self.id && t2s>t1s );
        }).length;
  };

  this.gamesLost=function() {
      return self.gamesDone().filter(function(x) {
            t1s=x.teamStat(x.team1().id,'Score');
            t2s=x.teamStat(x.team2().id,'Score');
            return ( x.team1().id==self.id && t1s<t2s ) || ( x.team2().id==self.id && t2s<t1s );
        }).length;
  };

  this.gamesTied=function() {
      return self.gamesDone().filter(function(x) {
            t1s=x.teamStat(x.team1().id,'Score');
            t2s=x.teamStat(x.team2().id,'Score');
            return ( x.team1().id==self.id || x.team2().id==self.id ) && t2s==t1s;
        }).length;
  };


  this.gamesStat=function(statName) {
      return ybt.games.map(function(x) {
            t1s=x.teamStat(x.team1().id,statName);
            t2s=x.teamStat(x.team2().id,statName);
            if( x.team1().id==self.id ) {
               return t1s;
            } else {
               if( x.team2().id==self.id ) {
                 return t2s;
               } else { return 0; }
            }
        }).reduce(function(a,b) { return a+b; },0);
  };

}
