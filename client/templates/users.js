Template.users.rendered = function() {
  Camera.keepUserSnapshotUpdated()
}

Template.users.helpers({
  otherUsers: function() {
    return Users.find({ _id: { $ne: User._id } })
  },
  user: function() {
    return Users.findOne(User._id)
  }
})

Template.users.events({
  'keypress #nick': function(evt) {
    if (Helpers.isEnter(evt)) {
      updateUserNick()
    }
  },
  'focusout #nick': updateUserNick,
  'dblclick .snapshot': function(evt) {
    var kickedOutUserId = evt.currentTarget.id
    if (kickedOutUserId) { // prevent auto kickouts
      Mentions.insert({
        author: User.nick,
        to: 'all',
        room: Rooms.findOne().name,
        body: 'I removed ' + Users.findOne(kickedOutUserId).nick + ' from the room',
        snapshot: Camera.takeSnapshot()
      })
      Meteor.call('kickout', currentRoom().name, evt.currentTarget.id)
      Notifier.playSound('kickuser')
    }
  },
  'click .snapshot': function(evt) {
    evt.preventDefault()
    switch (Session.get('clickSnapshotAction')) {
      case 'notifyWhenBack':
        $(evt.currentTarget).addClass('notifyWhenBack')
        imageComparator(evt.currentTarget).onDiff(function() {
          Notifier.showNotification({
            author: 'App',
            body: 'He\'s back, in pog form!',
            snapshot: evt.currentTarget.src
          })
        })
        break
    }
    Session.set('clickSnapshotAction', null)
  },
  'click #user-snapshot': function() {
    var currentFilter = Session.get('status.class')
    var toggleFilter = (!currentFilter ? 'blur' : '')
    Session.set('status.class', toggleFilter)
  },
  'mousewheel #user-snapshot': Camera.UI.chromeZoom,
  'MozMousePixelScroll #user-snapshot': Camera.UI.firefoxZoom
})

function updateUserNick() {
  User.nick = $('#nick').val()
  Session.set('user.nick', User.nick)
  $.jStorage.set('user', User)
  Users.upsert(User._id, { $set: { nick: User.nick } })
}