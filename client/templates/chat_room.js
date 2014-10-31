Notification.requestPermission()

Session.setDefault('picWidth', 58)
Session.setDefault('picHeight', 47)
Session.setDefault('camClose', true)

Template.chat_room.rendered = function() {
  Session.set('roomName', this.data.roomName)
  Tracker.autorun(showMentions)
  Tracker.autorun(notifyOnConnectionLost())
  Meteor.call('addToRoom', Session.get('roomName'), Session.get('user')._id)

  function showMentions() {
    var user = Session.get('user')
    var caseInsensitiveNick = new RegExp('^' + user.nick + '$', 'i')
    var mentionsToUser = Mentions.find({ to: { $in: [caseInsensitiveNick, 'all'] }, from: { $ne: caseInsensitiveNick } })
    mentionsToUser.forEach(Notifier.notify)
    // remove them after they are displayed.
    // Not user Mentions.remove({ to: user.nick }) because a mention can be created in the meanwhile
    mentionsToUser.forEach(function(msg) {
      Mentions.remove(msg._id)
    })
  }

  function notifyOnConnectionLost() {
    var hasConnected = false
    return function() {
      hasConnected = hasConnected || Meteor.status().connected
      if (hasConnected) {
        // when it connects, why start watching for disconnections
        if (!Meteor.status().connected) {
          setTimeout(function() {
            if (!Meteor.status().connected) {
              $('#connectionLostModal').modal('show')
              Notifier.notify({
                from: 'App',
                body: 'It seems that you\'ve lost conection with the server'
              })
            }
          }, 3000)
        }
      }
    }
  }
}

window.onbeforeunload = function() {
  Meteor.call('kickout', Session.get('roomName'), Session.get('user')._id)
}