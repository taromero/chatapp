Auth = {
  toRoom: function(password, room, cb) {
    Meteor.call('allowedForRoom', password, room, cb)
  },
  masterAuth: function(password, cb) {
    Meteor.call('masterAuth', password, cb)
  }
}