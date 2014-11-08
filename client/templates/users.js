Template.users.rendered = function() {
  Meteor.setInterval(function() {
    var snapshot = Camera.takeSnapshot()
    // For some reason, if we call Users.update directly here, we get an error on production:
    // 'Server sent add for existing id'
    Meteor.call('setSnapshot', User._id, snapshot, Session.get('status.class'))
  }, 1000)
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
      console.log(2)
      Mentions.insert({
        author: User.nick,
        to: 'all',
        body: 'I removed ' + Users.findOne(kickedOutUserId).nick + ' from the room',
        snapshot: Camera.takeSnapshot()
      })
      Meteor.call('kickout', currentRoom().name, evt.currentTarget.id)
      Notifier.playSound('kickuser')
    }
  },
  'click .snapshot': function(evt) {
    if (Session.get('clickAndCallMode')) {
      evt.preventDefault()
      var callerId = User._id
      var calleeId = evt.currentTarget.id
      Caller.call(callerId, calleeId)
    }
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