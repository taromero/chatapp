Meteor.publish('messages', function(roomName) {
  return Messages.find({ room: roomName })
})

Meteor.publish('users', function(roomName) {
  return Meteor.users.find({ connectedTo: { $elemMatch: { $in: [roomName] } } })
})

Meteor.publish('mentions', function(roomName) {
  return Mentions.find({ room: roomName })
})

Meteor.publish('rooms', function() {
  return Rooms.find()
})

Meteor.publish('room', function(roomName) {
  return Rooms.find({ name: roomName })
})

Meteor.publish('calls', function(roomName) {
  return Calls.find({ room: roomName })
})
