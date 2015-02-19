  $(document).ready(function() {
    // Show browser version
    $('#browsers').text(navigator.userAgent);

    $('#decideFollowBtn').click(function() {
       $('#decideFollowCreate').hide();
       $('#ybpConnectDiv').show();
       $('#backBtnDiv').show();
    });
    $('#decideCreateBtn').click(function() {
       $('#decideFollowCreate').hide();
       $('#tournamentDiv').show();
       $('#backBtnDiv').show();
    });

    $('#ybpConnectConnectBtn').click(function() {
         $('#ybpConnectDiv').hide();
         $('#tournamentDiv').show();
    });
    $('#ybpConnectContinueBtn').click(function() {
         $('#ybpConnectDiv').hide();
         $('#tournamentDiv').show();
    });

    $('#Chat,#Teams,#Players,#Games,#backBtn').click(function() {
       $('#tournamentDiv').hide();
       $('#backBtnDiv').hide();
    });
    $('#backBtn').click(function() {
       $('#ybpConnectDiv').hide();
       $('#decideFollowCreate').show();
    });
    $('#Chat,#Teams,#Players,#Games').click(function() {
       $('#backBtn2Div').show();
    });
    $('#Chat').click(function() {
       $('#ybpConnectDiv').show();
    });
    $('#backBtn2').click(function() {
       $('#tournamentDiv').show();
       $('#backBtnDiv').show();
       $('#ybpConnectDiv').hide();
       $('#TeamsDiv').hide();
       $('#PlayersDiv').hide();
       $('#GamesStateDiv').hide();
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
