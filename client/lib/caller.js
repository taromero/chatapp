Caller = {
  call: function(callerId, calleeId) {
    var callee = Users.findOne(calleeId)
    if (callee.callConf == 'calling-disabled') {
      Session.set('clickAndCallMode', false)
      alert('user doesn\'t allow calls at this moment')
    } else if (usersInActiveVideoChat(callerId, calleeId)) {
      Session.set('clickAndCallMode', false)
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
  receive: function(call) {

  },
  answer: function(callRoom, $localVideo) {
    if (Caller.webrtc_connection) {
      Caller.webrtc_connection.joinRoom(callRoom)
      $localVideo.show()
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
        Caller.webrtc_connection.joinRoom(callRoom)
        $localVideo.show()
      })
    }
  },
  hang: function($localVideo) {
    if (Caller.webrtc_connection) {
      Caller.webrtc_connection.leaveRoom()
      $localVideo.hide()
    }
  }
}