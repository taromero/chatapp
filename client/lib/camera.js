// this obj is initialized on 'video' template
Camera = {
  localMediaStream: null,
  canvas: null,
  canvasCtx: null,
  video: null,
  takeSnapshot: function() {
    if (Camera.localMediaStream) {
      Camera.canvasCtx.drawImage(Camera.video, 0, 0, 50, 50)
      return Camera.canvas.toDataURL('image/png')
    }
  }
}