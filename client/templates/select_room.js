Template.select_room.helpers({
  rooms: function() {
    return Rooms.find()
  }
})

Template.select_room.events({
  'click .enterRoom': function(evt) {
    var roomName = evt.currentTarget.id
    Router.go('/rooms/' + roomName)
  }
})
