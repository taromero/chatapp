Template.users.rendered = function() {
  Meteor.setInterval(function() {
    var snapshot = Camera.takeSnapshot()
    Users.update(User._id, { $set: { snapshot: snapshot, effect: Session.get('status.class') } })
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
    if (parseFloat(kickedOutUserId)) { // prevent auto kickouts
      console.log(2)
      Mentions.insert({
        author: User.nick,
        to: 'all',
        body: 'I removed ' + Users.findOne(parseFloat(kickedOutUserId)).nick + ' from the room',
        snapshot: Camera.takeSnapshot()
      })
      Meteor.call('kickout', currentRoom().name, evt.currentTarget.id)
      Notifier.playSound('kickuser')
    }
  },
  'click .snapshot': function(evt) {
    if (Session.get('clickAndCallMode')) {
      var callerId = User._id
      var calleeId = parseFloat(evt.currentTarget.id)
      evt.preventDefault()
      var callee = Users.findOne(calleeId)
      if (callee.callConf == 'calling-disabled') {
        Session.set('clickAndCallMode', false)
        alert('user doesn\'t allow calls at this moment')
      } else if (usersInActiveVideoChat(callerId, calleeId)) {
        Session.set('clickAndCallMode', false)
        alert('One of the users is currently on a video chat. Wait until it hangs the other call.')
      } else {
        Calls.insert({ from: callerId, to: calleeId,
                        room: currentRoom().name, callRoom: Math.random().toString() })
      }
    }

    function usersInActiveVideoChat(callerId, calleeId) {
      var count = Calls.find({ $or: [
        { from: { $in: [callerId, calleeId] } },
        { to: { $in: [callerId, calleeId] } }
      ]}).count()

      return count > 0
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
  $.jStorage.set('user', User)
  Users.upsert(User._id, { $set: { nick: User.nick } })
}