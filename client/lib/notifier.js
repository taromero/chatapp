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
    var standardConf = Session.get()
    Audios[Session.get('sounds.' + soundType) || 'default'].play()
  }
}

Audios = {}

// preload sounds
var sounds = ['default', 'sparkling_water', 'horse', 'magnum_shot', 'water_drum', 'phone_ringing']

sounds.forEach(function(soundName) {
  Audios[soundName] = new Audio('/audio/' + soundName + '.ogg')
  Audios[soundName].load()
})

var highLevelConf = {
  silent: {
    mention: 'default',
    newMessage: '',
    changeTitleOnMsg: false
  },
  soft: {
    mention: 'default',
    newMessage: 'sparkling_water',
    changeTitleOnMsg: true
  },
  loud: {
    mention: 'default',
    newMessage: 'default',
    changeTitleOnMsg: true
  }
}