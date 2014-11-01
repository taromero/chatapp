Template.rooms.helpers({
  rooms: function() {
    return Rooms.find()
  },
  roomToEdit: function() {
    return Session.get('roomToEdit')
  }
})

Template.rooms.events({
  'click #upsert': function() {
    var roomName = $('#name').val()
    // meteor 'inseure' package restriction: upsert only by id
    var room = Rooms.findOne({ name: roomName })
    var updatedRoom = { name: roomName, imageType: $('#imageType').val() || 'jpeg' }
    if ($('#password').val()) { //only change password if something was set
      updatedRoom.password = $('#password').val()
    }
    Rooms.update(room && room._id, { $set: updatedRoom })
    Session.set('roomToEdit', {})
    $('#roomModal').modal('hide')
  },
  'click .delete': function(evt) {
    var roomId = evt.currentTarget.id
    Rooms.remove(roomId)
  },
  'click .edit': function(evt) {
    var roomToEdit = Rooms.findOne(evt.currentTarget.id, { fields: { password: 0 } })
    Session.set('roomToEdit', roomToEdit)
    $('#roomModal').modal('show')
  }
})
