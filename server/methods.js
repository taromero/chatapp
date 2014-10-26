Meteor.methods({
  allowedForRoom: function(password, roomName) {
    console.log('roomName', roomName)
    var room = Rooms.findOne({ name: roomName })
    if (password == room.password) {
      return true;
    } else {
      throw new Meteor.Error(401, 'Not allowed for room: ' + roomName)
    }
  }
})