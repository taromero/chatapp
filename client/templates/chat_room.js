Notification.requestPermission()

Template.chat_room.rendered = function() {
  Tracker.autorun(showMentions)
  Meteor.call('addToRoom', Session.get('roomName'), Session.get('user')._id)

  function showMentions() {
    var user = Session.get('user')
    var caseInsensitiveNick = new RegExp('^' + user.nick + '$', 'i')
    var mentionsToUser = Mentions.find({ to: { $in: [caseInsensitiveNick, 'all'] }, from: { $ne: caseInsensitiveNick } })
    mentionsToUser.forEach(function(msg) {
      showNotification(msg)
    })
    // remove them after they are displayed.
    // Not user Mentions.remove({ to: user.nick }) because a mention can be created in the meanwhile
    mentionsToUser.forEach(function(msg) {
      Mentions.remove(msg._id)
    })

    function showNotification(msg) {
      var notification = new Notification(msg.from, {
        body: msg.body,
        icon: msg.snapshot
      })
      notification.onclick = function() {
        notification.close()
      }
      setTimeout(function() {
        notification.close()
      }, 5000)
    }

  }
}

window.onbeforeunload = function() {
  Meteor.call('kickout', Session.get('roomName'), Session.get('user')._id)
}