  $(document).ready(function() {

    // Show browser version
    $('#browsers').text(navigator.userAgent);

    $('#Login,#Chat,#Teams,#Players,#Games,#backBtn,#Saved').click(function() {
       $('#tournamentDiv').hide();
    });
    $('#Login,#Chat,#Teams,#Players,#Games,#Saved').click(function() {
       $('#backBtn2Div').show();
    });
    $('#Login').click(function() {
       $('#LoginDiv1').show();
    });
    $('#Chat').click(function() {
       $('#ybpConnectDiv').show();
    });
    $('#backBtn2').click(function() {
       $('#tournamentDiv').show();
       $('#LoginDiv1').hide();
       $('#ybpConnectDiv').hide();
       $('#TeamsDiv').hide();
       $('#PlayersDiv').hide();
       $('#GamesStateDiv').hide();
       $('#SavedDiv').hide();
       $('#backBtn2Div').hide();
    });
    $('#Teams').click(function() {
       $('#TeamsDiv').show();
    });
    $('#Players').click(function() {
       $('#PlayersDiv').show();
    });
    $('#Games').click(function() {
       $('#GamesStateDiv').show();
    });
    $('#Saved').click(function() {
       $('#SavedDiv').show();
    });

    $('#GamesDone,#GamesPlaying,#GamesWaiting').click(function() {
       $('#GamesStateDiv').hide();
       $('#backBtn2Div').hide();
       $('#GamesDiv').show();
       $('#backBtn3Div').show();
    });
    $('#backBtn3').click(function() {
       $('#GamesStateDiv').show();
       $('#backBtn2Div').show();
       $('#GamesDiv').hide();
       $('#backBtn3Div').hide();
    });

    $('#LoginNew,#LoginExisting').click(function() {
       $('#LoginDiv1').hide();
       $('#backBtn2Div').hide();
       $('#LoginDiv2').show();
       $('#backBtn4Div').show();
    });
    $('#backBtn4').click(function() {
       $('#LoginDiv1').show();
       $('#backBtn2Div').show();
       $('#LoginDiv2').hide();
       $('#backBtn4Div').hide();
    });

  });


function comparePlayers(a,b) {
  if(a.team().name < b.team().name) return -1;
  if(a.team().name > b.team().name) return +1;
  if(a.name < b.name) return -1;
  if(a.name > b.name) return +1;
  return 0;
};

function compareTeams(a,b) {
  if(a.name < b.name) return -1;
  if(a.name > b.name) return +1;
  return 0;
};

function compareGames(a,b) {
  if(a.team1().name < b.team1().name) return -1;
  if(a.team1().name > b.team1().name) return +1;
  if(a.team2().name < b.team2().name) return -1;
  if(a.team2().name > b.team2().name) return +1;
  return 0;
};

function comparePeers(a,b,regist,nicks) {
// a, b: peer ids
// sorting: trusted peers, peers with emails, sorted emails, peers with nicknames, sorted nicknames, sorted peer ids
  if( nicks[a] && !nicks[b] ) return -1;
  if(!nicks[a] &&  nicks[b] ) return +1;
  if( nicks[a] &&  nicks[b] ) {
    if( nicks[a].email && !nicks[b].email) return -1;
    if(!nicks[a].email &&  nicks[b].email) return +1;
    if(regist.metaD && regist.metaD.network.length>0) {
       if(regist.metaD.network.indexOf(nicks[a].email)!=-1 && regist.metaD.network.indexOf(nicks[b].email)==-1) return -1;
       if(regist.metaD.network.indexOf(nicks[a].email)==-1 && regist.metaD.network.indexOf(nicks[b].email)!=-1) return +1;
    }
    if(nicks[a].email < nicks[b].email) return -1;
    if(nicks[a].email > nicks[b].email) return +1;
    if( nicks[a].val && !nicks[b].val) return -1;
    if(!nicks[a].val &&  nicks[b].val) return +1;
    if(nicks[a].val < nicks[b].val) return -1;
    if(nicks[a].val > nicks[b].val) return +1;
  }
  if(a < b) return -1;
  if(a > b) return +1;
  return 0;
};

