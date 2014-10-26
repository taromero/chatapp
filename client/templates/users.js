Template.users.helpers({
  otherUsers: function() {
    return Users.find({ _id: { $ne:  Session.get('user')._id } })
  },
  user: function() {
    return Users.findOne(Session.get('user')._id)
  }
})

Template.users.events({
  'keypress #nick': function(evt) {
    debugger;
    if (Helpers.isEnter(evt)) {
      Users.upsert(Session.get('user')._id, { $set: { nick: $('#nick').val() } })
    }
  }
})