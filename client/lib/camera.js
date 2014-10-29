// this obj is initialized on 'video' template
Camera = {
  localMediaStream: null,
  canvas: null,
  canvasCtx: null,
  video: null,
  takeSnapshot: function() {
    if (Camera.localMediaStream) {
      Camera.canvasCtx.drawImage(Camera.video,
        /* focus on the center of the image*/
        160, 120, 360, 240, 0, 0,
        /* give image size */
        58, 47);
      return Camera.canvas.toDataURL('image/png')
    }
  }
}