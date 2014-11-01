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
      var sx = picW * 2.6
      console.log('sx', sx)
      var sy = sx / xToYScale
      var sWidth = sx * 2
      var sHeight = sy * 2
      var dx = Session.get('camera.distanceFromEdge')
      var dy = dx / xToYScale
      Camera.canvasCtx.drawImage(Camera.video,
        /* focus on the center of the image*/
        sx - dx, sy - dy, sWidth + dx*2, sHeight + dy*2, 0, 0,
        // 0, 0, 580, 470, 0, 0,
        // 0,0,
        /* give image size */
        picW, picH);
      return Camera.canvas.toDataURL('image/' + Session.get('imageType'))
    }
  }
}