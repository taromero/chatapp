Auth = {
  toRoom: function(password, room, cb) {
    Meteor.call('allowedForRoom', password, room, cb)
  }
}