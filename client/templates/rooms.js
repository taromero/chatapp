Template.rooms.helpers({
  rooms: function() {
    return Rooms.find()
  }
})

Template.rooms.events({
  'click #create': function() {
    var roomName = $('#name').val()
    // meteor 'inseure' package restriction: upsert only by id
    var room = Rooms.findOne({ name: roomName })
    Rooms.upsert(room && room._id, { name: roomName, password: $('#password').val() })
    $('#roomModal').modal('hide')
  },
  'click .delete': function(evt) {
    var roomId = evt.currentTarget.id
    Rooms.remove(roomId)
  }
})
