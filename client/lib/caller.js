Caller = {
  call: function(callerId, calleeId) {
    var callee = Users.findOne(calleeId)
    if (usersInActiveVideoChat(callerId, calleeId)) {
      alert('One of the users is currently on a video chat. Wait until it hangs the other call.')
    } else {
      Calls.insert({ from: callerId, to: calleeId,
                      room: currentRoom().name, callRoom: Math.random().toString() })
    }

    function usersInActiveVideoChat(callerId, calleeId) {
      var count = Calls.find({ $or: [
        { from: { $in: [callerId, calleeId] } },
        { to: { $in: [callerId, calleeId] } }
      ]}).count()

      return count > 0
    }
  },
  answer: function() {
    var call = Session.get('call')
    if (Caller.webrtc_connection) {
      Caller.webrtc_connection.joinRoom(call.callRoom)
      $('#localVideo').show()
    } else {
      var rtc_options = {
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remotesVideos',
        // immediately ask for camera access
        autoRequestMedia: true
      }

      Caller.webrtc_connection = new SimpleWebRTC(rtc_options)

      // we have to wait until it's ready
      Caller.webrtc_connection.on('readyToCall', function () {
        // you can name it anything
        Caller.webrtc_connection.joinRoom(call.callRoom)
        $('#localVideo').show()
      })
    }
  },
  hang: function() {
    if (Caller.webrtc_connection) {
      Caller.webrtc_connection.leaveRoom()
      $('#localVideo').hide()
    }
    if (Session.get('call')) {
      Calls.remove(Session.get('call')._id)
      Session.set('call', null)
    }
  }
}