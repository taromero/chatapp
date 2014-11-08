Notification.requestPermission()


Session.setDefault('picWidth', 58)
Session.setDefault('picHeight', 47)
Session.setDefault('camera.distanceFromEdge', 0)

Template.chat_room.rendered = function() {
  resetTitleOnUserFocus()
  handleNotifications()
  Tracker.autorun(showMentions)
  Meteor.call('addToRoom', currentRoom().name, User._id)

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
        if (Session.get('titleNotifications')) {
          document.title = doc.body
        }
        switch (Session.get('notificationsLevel')) {
          case 1:
            return null
          case 2:
            return (TimeHelper.serverTimestamp() - User.lastMsgTimestamp < 10000) ? Notifier.playSound('newMessage') : null
          case 3:
            return (TimeHelper.serverTimestamp() - User.lastMsgTimestamp < 10000) ? Notifier.notify(doc) : null
          case 4:
            return Notifier.playSound('newMessage')
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
}

window.onbeforeunload = function() {
  Meteor.call('kickout', currentRoom().name, User._id)
}