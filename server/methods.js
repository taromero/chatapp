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
    if (process.env.MASTER_PASSWORD && password == process.env.MASTER_PASSWORD) {
      return true
    } else {
      throw new Meteor.Error(401, 'Not allowed')
    }
  },
  checkUserExistance: function(userId) {
    if (Users.find(userId).count() > 0) {
      return true;
    } else {
      throw new Meteor.Error(400, 'User don\'t exist anymore on the DB, auth again')
    }
  },
  removeRoom: function(roomId) {
    Rooms.remove(roomId)
    Messages.remove({ roomId: roomId })
    Mentions.remove({ roomId: roomId })
  }
})