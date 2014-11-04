Session.setDefault('sounds.mention', 'default')
Session.setDefault('sounds.newMessage', 'sparkling_water')
Session.setDefault('sounds.noCamera', 'horse')
Session.setDefault('sounds.kickuser', 'magnum_shot')

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
    }, 4000)
  },
  playSound: function(soundType) {
    Audios[Session.get('sounds.' + soundType) || 'default'].play()
  }
}

Audios = {}

preloadSounds()

function preloadSounds() {
  var sounds = ['default', 'sparkling_water', 'horse', 'magnum_shot', 'water_drum', 'phone_ringing', 'stick']

  sounds.forEach(function(soundName) {
    Audios[soundName] = new Audio('/audio/' + soundName + '.ogg')
    Audios[soundName].load()
  })
}