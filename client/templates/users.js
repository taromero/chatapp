Template.users.rendered = function() {
  Meteor.setInterval(function() {
    var snapshot = Camera.takeSnapshot()
    Users.update(Session.get('user')._id, { $set: { snapshot: snapshot, effect: Session.get('status.class') } })
  }, 1000)
}

Template.users.helpers({
  otherUsers: function() {
    return Users.find({ _id: { $ne: Session.get('user')._id } })
  },
  user: function() {
    return Users.findOne(Session.get('user')._id)
  }
})

Template.users.events({
  'keypress #nick, focusout #nick': function(evt) {
    if (Helpers.isEnter(evt)) {
      var user = Session.get('user')
      user.nick = $('#nick').val()
      Session.set('user', user)
      Users.upsert(user._id, { $set: { nick: user.nick } })
    }
  },
  'click .snapshot': function(evt) {
    console.log('aaaaaaaaaaaaaa')
    Meteor.call('kickout', Session.get('roomName'), evt.currentTarget.id)
  }
})

Tracker.autorun(keepSessionUserPersisted)

function keepSessionUserPersisted() {
  var user = Session.get('user')
  if (user) $.jStorage.set('user', user)
}