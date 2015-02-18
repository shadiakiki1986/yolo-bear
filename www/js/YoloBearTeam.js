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

  this.games=function() {
      return ybt.games
        .filter(function(x) { return x.state=="Done"; })
        .filter(function(x) { return x.team1().id==self.id || x.team2().id==self.id; });
  };

  this.gamesWon=function() {
      return self.games().filter(function(x) {
            t1s=x.teamScore(x.team1().id);
            t2s=x.teamScore(x.team2().id);
            return ( x.team1().id==self.id && t1s>t2s ) || ( x.team2().id==self.id && t2s>t1s );
        }).length;
  };

  this.gamesLost=function() {
      return self.games().filter(function(x) {
            t1s=x.teamScore(x.team1().id);
            t2s=x.teamScore(x.team2().id);
            return ( x.team1().id==self.id && t1s<t2s ) || ( x.team2().id==self.id && t2s<t1s );
        }).length;
  };

  this.gamesTied=function() {
      return self.games().filter(function(x) {
            t1s=x.teamScore(x.team1().id);
            t2s=x.teamScore(x.team2().id);
            return ( x.team1().id==self.id || x.team2().id==self.id ) && t2s==t1s;
        }).length;
  };


}
