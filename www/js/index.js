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

    $('#backBtn').click(function() {
       $('#ybpConnectDiv').hide();
       $('#tournamentDiv').hide();
       $('#backBtnDiv').hide();
       $('#decideFollowCreate').show();
    });

    $('#Chat').click(function() {
       $('#tournamentDiv').hide();
       $('#backBtnDiv').hide();
       $('#ybpConnectDiv').show();
       $('#backBtn2Div').show();
    });
    $('#backBtn2').click(function() {
       $('#tournamentDiv').show();
       $('#backBtnDiv').show();
       $('#ybpConnectDiv').hide();
       $('#TeamsDiv').hide();
       $('#PlayersDiv').hide();
       $('#GamesDiv').hide();
       $('#backBtn2Div').hide();
    });
    $('#Teams').click(function() {
       $('#tournamentDiv').hide();
       $('#backBtnDiv').hide();
       $('#TeamsDiv').show();
       $('#backBtn2Div').show();
    });
    $('#Players').click(function() {
       $('#tournamentDiv').hide();
       $('#backBtnDiv').hide();
       $('#PlayersDiv').show();
       $('#backBtn2Div').show();
    });
    $('#Games').click(function() {
       $('#tournamentDiv').hide();
       $('#backBtnDiv').hide();
       $('#GamesDiv').show();
       $('#backBtn2Div').show();
    });

  });


