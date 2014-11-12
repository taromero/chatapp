Session.setDefault('sounds.mention', 'default')
Session.setDefault('sounds.newMessage', 'sparkling_water')
Session.setDefault('sounds.noCamera', 'horse')
Session.setDefault('sounds.kickuser', 'magnum_shot')

Notifier = {
  init: function() {
    resetTitleOnUserFocus()
    handleNotifications()
    Tracker.autorun(showMentions)
  },
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

function resetTitleOnUserFocus() {
  $(window).focus(function(){
    document.title = 'chatapp'
  })
}

function handleNotifications() {
  Messages.find({ timestamp: { $gt: TimeHelper.serverTimestamp() } }).observe({
    added: function(doc) {
      if (User.nick == doc.author) {
        return;
      }

      document.title = doc.body

      switch (Session.get('notificationsLevel')) {
        case 1:
          return null
        case 2:
          return Notifier.playSound('newMessage')
        case 3:
          return Notifier.notify(doc)
        default:
          //do nothing
          return null
      }
    }
  })
}

function showMentions() {
  // we need to get the nick from a reactive variable, as the cursor that is made
  // later on `Mentions.find` will have the nick of the beginning an the computation
  // won't run again (as that cursor won't change).
  var userNick = Session.get('user.nick') || User.nick
  var caseInsensitiveNick = new RegExp('^' + userNick + '$', 'i')
  var mentionsToUser = Mentions.find({ to: { $in: [caseInsensitiveNick, 'all'] }, author: { $not: { $regex: caseInsensitiveNick } } })
  mentionsToUser.forEach(Notifier.notify)
  // remove them after they are displayed.
  // Not user Mentions.remove({ to: user.nick }) because a mention can be created in the meanwhile
  mentionsToUser.forEach(function(msg) {
    Mentions.remove(msg._id)
  })
}