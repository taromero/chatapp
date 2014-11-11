Session.set('acceptedCamera', false)

Template.videoRecorder.rendered = function() {
  notifyIfCameraNotAccepted()
  Session.set('imageType', currentRoom().imageType)
  Session.setDefault('imageType', 'jpeg')
  Camera.video = document.querySelector('video')
  Camera.canvas = document.querySelector('canvas')
  Camera.canvasCtx = Camera.canvas.getContext('2d')

  Camera.video.addEventListener('click', Camera.takeSnapshot, false)

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  // Not showing vendor prefixes or code that works cross-browser.
  navigator.getUserMedia({video: true}, function(stream) {
    Session.set('acceptedCamera', true)
    Camera.video.src = window.URL.createObjectURL(stream)
    Camera.localMediaStream = stream
    setTimeout(Camera.updateUserSnapshot, 500) //leave some time to be able to fetch a picture
  }, function (err, res) {
    console.log('err: ', err)
    console.log('res: ', res)
  })
}

Template.videoRecorder.helpers({
  picHeight: function() {
    return Session.get('picHeight') + 'px'
  },
  picWidth: function() {
    return Session.get('picWidth') + 'px'
  }
})

function notifyIfCameraNotAccepted() {
  // If camera hasn't been accepted after a while, show 1 notification and start playing
  // a sound on a regular interval to alert the user
  var interval = null
  setTimeout(function() {
    if (!Session.get('acceptedCamera')) {
      Notifier.playSound('noCamera')
      interval = setInterval(function() {
        if (!Session.get('acceptedCamera')) {
          Notifier.playSound('noCamera')
        } else {
          clearInterval(interval)
        }
      }, 10*1000)
      Notifier.showNotification({
        author: 'App',
        body: 'You have not accepted the camera yet!'
      })
    }
  }, 5000)
}