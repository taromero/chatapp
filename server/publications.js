Meteor.publish('messages', function() {
  return Messages.find()
})

Meteor.publish('users', function(roomName) {
  return Users.find({ connectedTo: { $elemMatch: { $in: [roomName] } } })
})

Meteor.publish('mentions', function() {
  return Mentions.find()
})

Meteor.publish('rooms', function() {
  return Rooms.find()
})