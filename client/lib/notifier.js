Notifier = {
  notify: function(msg) {
    Notifier.showNotification(msg)
    Notifier.playSound()
  },
  showNotification: function(msg) {
    var notification = new Notification(msg.author, {
      body: msg.body,
      icon: msg.snapshot
    })
    notification.onclick = function() {
      notification.close()
    }
    setTimeout(function() {
      notification.close()
    }, 5000)
  },
  playSound: function() {
    var sound = new Audio('/audio/notification.ogg')
    sound.play()
  }
}