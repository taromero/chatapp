Session.set('picToCanvasRatio', 2.6) // empirically obtained :). TODO: understand this number
Session.setDefault('picWidth', 58)
Session.setDefault('picHeight', 47)
Session.setDefault('camera.distanceFromEdge', 0)

// this obj is initialized on 'video' template
Camera = {
  localMediaStream: null,
  canvas: null,
  canvasCtx: null,
  video: null,
  takeSnapshot: function() {
    if (Camera.localMediaStream) {
      // spec: drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      //  Given an image, this function takes the area of the source image specified by the rectangle whose top-left corner is (sx, sy)
      //  and whose width and height are sWidth and sHeight and draws it into the canvas, placing it on the canvas at (dx, dy) and
      //  scaling it to the size specified by dWidth and dHeight.
      var picW = Session.get('picWidth')
      var picH = Session.get('picHeight')
      var xToYScale = picW/picH
      var sx = picW * Session.get('picToCanvasRatio')
      var sy = sx / xToYScale
      var sWidth = sx * 2
      var sHeight = sy * 2
      var dx = Session.get('camera.distanceFromEdge')
      var dy = dx / xToYScale

      Camera.canvasCtx.drawImage(Camera.video,
        /* focus on the center of the image*/
        sx - dx, sy - dy, sWidth + dx*2, sHeight + dy*2, 0, 0,
        /* give image size */
        picW, picH);
      return Camera.canvas.toDataURL('image/' + Session.get('imageType'))
    }
  },
  keepUserSnapshotUpdated: function() {
    Camera.updateUserSnapshot()
    var snapshopInterval = Meteor.settings.public.snapshot_refresh_interval || 2500
    Meteor.setInterval(Camera.updateUserSnapshot, snapshopInterval)
  },
  updateUserSnapshot: function() {
    var snapshot = Camera.takeSnapshot()
    // For some reason, if we call Users.update directly here, we get an error on production:
    // 'Server sent add for existing id'
    Meteor.call('setSnapshot', User._id, snapshot, Session.get('status.class'))
  },
  UI: {
    chromeZoom: function(evt) {
      evt.preventDefault();
      Camera.UI.zoom(evt.originalEvent.wheelDeltaY < 0 ? 'down' : 'up')
    },
    firefoxZoom: function(evt) {
      evt.preventDefault();
      var delta = parseInt(evt.originalEvent.wheelDelta || -evt.originalEvent.detail);
      Camera.UI.zoom(delta < 0 ? 'down' : 'up')
    },
    zoom: function(direction) {
      var zoomFactor = 5
      var distance = Session.get('camera.distanceFromEdge')
      if (direction == 'up') { // scroll down
        if ((distance - zoomFactor) >= 0) {
          Session.set('camera.distanceFromEdge', distance - zoomFactor)
        }
      } else {
        if ((distance + zoomFactor) <= (Session.get('picWidth') * 2.6)) {
          Session.set('camera.distanceFromEdge', distance + zoomFactor)
        }
      }
    }
  }
}