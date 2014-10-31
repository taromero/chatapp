Meteor.methods({
  allowedForRoom: function(password, roomName) {
    var room = Rooms.findOne({ name: roomName })
    if (password == room.password) {
      return true;
    } else {
      throw new Meteor.Error(401, 'Not allowed for room: ' + roomName)
    }
  },
  addToRoom: function(roomName, userId) {
    var user = Users.findOne(parseFloat(userId))
    if (!_(user.connectedTo).contains(roomName)) {
      Users.update(userId, { $push: { connectedTo: roomName } })
    }
  },
  kickout: function(roomName, userId) {
    Users.update(parseFloat(userId), { $pull: { connectedTo: roomName } })
  },
  masterAuth: function(password) {
    if (password == 'jsrocks') {
      return true
    } else {
      throw new Meteor.Error(401, 'Not allowed')
    }
  }
})