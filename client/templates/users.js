Template.users.helpers({
  users: function() {
    return Users.find()
  },
  user: function() {
    return Users.findOne(Session.get('user')._id)
  }
})