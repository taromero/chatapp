Meteor.methods({
  allowedForRoom: function(password, roomName) {
    var room = Rooms.findOne({ name: roomName })
    if (password == room.password) {
      var user = Meteor.user()
      if (!user.passwords) {
        user.passwords = {}
      }
      user.passwords[roomName] = password
      if (user._id) {
        Meteor.users.update({ _id: user._id }, user)
      } else {
        _id = Meteor.users.insert(user)
      }
      return true;
    } else {
      throw new Meteor.Error(401, 'Not allowed for room: ' + roomName)
    }
  },
  addToRoom: function(roomName, userId) {
    var user = Meteor.users.findOne(userId)
    console.log('00000000000000')
    if (!_(user.connectedTo).contains(roomName)) {
      console.log('aaaaaaaaaa')
      Meteor.users.update(userId, { $push: { connectedTo: roomName } })
    }
  },
  kickout: function(roomName, userId) {
    Meteor.users.update(userId, { $pull: { connectedTo: roomName } })
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
