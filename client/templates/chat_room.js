Notification.requestPermission()


Session.setDefault('picWidth', 58)
Session.setDefault('picHeight', 47)
Session.setDefault('camClose', true)

Template.chat_room.rendered = function() {
  handleNotifications()
  Session.set('roomName', this.data.roomName)
  Tracker.autorun(showMentions)
  Tracker.autorun(notifyOnConnectionLost())
  Meteor.call('addToRoom', Session.get('roomName'), User._id)

  function handleNotifications() {
    Messages.find({ timestamp: { $gt: TimeHelper.serverTimestamp() } }).observe({
      added: function(doc) {
        switch (Notifier.level) {
          case 1:
            return null
          case 2:
            return (TimeHelper.serverTimestamp() - User.lastMsgTimestamp < 10000) ? Notifier.playSound() : null
          case 3:
            return (TimeHelper.serverTimestamp() - User.lastMsgTimestamp < 10000) ? Notifier.notify(doc) : null
          case 4:
            return Notifier.playSound()
          case 5:
            return Notifier.notify(doc)
          default:
            //do nothing
            return null
        }
      }
    })
  }

  function showMentions() {
    var caseInsensitiveNick = new RegExp('^' + User.nick + '$', 'i')
    var mentionsToUser = Mentions.find({ to: { $in: [caseInsensitiveNick, 'all'] }, author: { $not: { $regex: caseInsensitiveNick } } })
    mentionsToUser.forEach(Notifier.notify)
    // remove them after they are displayed.
    // Not user Mentions.remove({ to: user.nick }) because a mention can be created in the meanwhile
    mentionsToUser.forEach(function(msg) {
      Mentions.remove(msg._id)
    })
  }

  function notifyOnConnectionLost() {
    var hasConnected = false
    var notified = false
    return function() {
      hasConnected = hasConnected || Meteor.status().connected
      if (hasConnected) {
        // when it connects, why start watching for disconnections
        if (!Meteor.status().connected && !notified) {
          setTimeout(function() {
            if (!Meteor.status().connected) {
              $('#connectionLostModal').modal('show')
              Notifier.notify({
                author: 'App',
                body: 'It seems that you\'ve lost conection with the server'
              })
            }
          }, 5000)
          notified = true
        }
      }
    }
  }
}

window.onbeforeunload = function() {
  Meteor.call('kickout', Session.get('roomName'), User._id)
}