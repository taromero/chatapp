Notification.requestPermission()

Session.setDefault('picWidth', 172)
Session.setDefault('picHeight', 140)

Template.chat_room.rendered = function() {
  Tracker.autorun(showMentions)
  Tracker.autorun(reloadOnLostConnetion)
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

  function reloadOnLostConnetion() {
    console.log('Meteor.status().connected ' , Meteor.status().connected);
    var reloadTimeout;
    if (!Meteor.status().connected) {
      reloadTimeout = setTimeout(function() {
        if (!Meteor.status().connected) {
          // if connection is also lost after a while, reload
          location.reload()
        }
      }, 2000)
    }
  }
}

window.onbeforeunload = function() {
  Meteor.call('kickout', Session.get('roomName'), Session.get('user')._id)
}