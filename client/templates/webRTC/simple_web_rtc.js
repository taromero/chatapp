Template.simple_web_rtc.rendered = function() {
  var webrtc = null
  Tracker.autorun(function() {
    if (Session.get('joinCall')) {
      if (webrtc) {
        webrtc.joinRoom('dafaultRoom')
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
          webrtc.joinRoom('dafaultRoom')
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
}