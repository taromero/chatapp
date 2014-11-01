Session.setDefault('sounds.mention', 'notification')
Session.setDefault('sounds.newMessage', 'sparkling_water')
Session.setDefault('sounds.noCamera', 'horse')

Notifier = {
  notify: function(msg) {
    Notifier.showNotification(msg)
    Notifier.playSound(msg.effect ? 'newMessage' : 'mention')
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
  playSound: function(soundType) {
    var sound = new Audio('/audio/' + (Session.get('sounds.' + soundType) || 'notification') + '.ogg')
    sound.play()
  }
}