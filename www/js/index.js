  $(document).ready(function() {
    // Show browser version
    $('#browsers').text(navigator.userAgent);
    $('#ybpConnectModal').modal('hide');

    $('#decideFollowBtn').click(function() { $('#ybpConnectDiv').show(); $('#decideFollowCreate').hide(); });
    $('#ybpConnectCancelBtn').click(function() { $('#ybpConnectDiv').hide(); $('#decideFollowCreate').show(); });

  });


