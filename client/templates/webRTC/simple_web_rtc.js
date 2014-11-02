Template.simple_web_rtc.rendered = function() {
  var webrtc = null
  Tracker.autorun(function() {
    if (Session.get('joinCall')) {
      var callRoom = Session.get('joinCall').callRoom || 'defaultRoom'
      if (webrtc) {
        webrtc.joinRoom(callRoom)
        $('#localVideo').show()
      } else {
        webrtc = new SimpleWebRTC({
          // the id/element dom element that will hold "our" video
          localVideoEl: 'localVideo',
          // the id/element dom element that will hold remote videos
          remoteVideosEl: 'remotesVideos',
          // immediately ask for camera access
          autoRequestMedia: true
        });

        // we have to wait until it's ready
        webrtc.on('readyToCall', function () {
          // you can name it anything
          webrtc.joinRoom(callRoom)
          $('#localVideo').show()
        })
      }
    } else {
      if (webrtc) {
        webrtc.leaveRoom()
        $('#localVideo').hide()
      }
    }
  })

  Calls.find({ $or: [{ from: User._id }, { to: User._id }] }).observe({
    added: function(call) {
      console.log('call', call)
      Session.set('joinCall', { callRoom: call.callRoom })
      Session.set('call', call)
    },
    removed: function(call) {
      console.log('call removed')
      Session.set('joinCall', false)
    }
  })
}