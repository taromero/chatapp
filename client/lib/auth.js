Auth = {
  toRoom: function(password, room, cb) {
    Meteor.call('allowedForRoom', password, room, cb)
  },
  masterAuth: function(password, cb) {
    Meteor.call('masterAuth', password, cb)
  },
  checkUserExistance: function(userId, cb) {
    // User might exist on local storage but not on the DB (e.g.: if the DB is cleaned)
    Meteor.call('checkUserExistance', userId, cb)
  }
}