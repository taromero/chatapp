Notification.requestPermission()


Session.setDefault('picWidth', 58)
Session.setDefault('picHeight', 47)
Session.setDefault('camClose', true)

Template.chat_room.rendered = function() {
  handleNotifications()
  Session.set('roomName', this.data.roomName)
  Tracker.autorun(showMentions)
  Meteor.call('addToRoom', Session.get('roomName'), User._id)

  function handleNotifications() {
    Messages.find({ timestamp: { $gt: TimeHelper.serverTimestamp() } }).observe({
      added: function(doc) {
        if (Session.get('titleNotifications') && (User.nick != doc.author)) {
          document.title = doc.body
        }
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
}

window.onbeforeunload = function() {
  Meteor.call('kickout', Session.get('roomName'), User._id)
}