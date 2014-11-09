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
    var user = Users.findOne(userId)
    if (!_(user.connectedTo).contains(roomName)) {
      Users.update(userId, { $push: { connectedTo: roomName } })
    }
  },
  kickout: function(roomName, userId) {
    Users.update(userId, { $pull: { connectedTo: roomName } })
  },
  masterAuth: function(password) {
    var masterPassword = Meteor.settings.master_password
    if (masterPassword && password == masterPassword) {
      return true
    } else {
      throw new Meteor.Error(401, 'Not allowed')
    }
  },
  removeRoom: function(roomId) {
    var room = Rooms.findOne(roomId)
    Rooms.remove(roomId)
    Messages.remove({ room: room.name })
    Mentions.remove({ room: room.name })
  }
})