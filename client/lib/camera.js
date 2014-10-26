// this obj is initialized on 'video' template
Camera = {
  localMediaStream: null,
  canvas: null,
  canvasCtx: null,
  video: null,
  takeSnapshot: function() {
    if (Camera.localMediaStream) {
      Camera.canvasCtx.drawImage(Camera.video, 0, 0, 50, 50)
      // "image/webp" works in Chrome.
      // Other browsers will fall back to image/png.
      return Camera.canvas.toDataURL('image/webp')
    }
  }
}