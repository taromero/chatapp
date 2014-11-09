Notification.requestPermission()

Template.chat_room.rendered = function() {
  Notifier.init()
  Meteor.call('addToRoom', currentRoom().name, User._id)
}

window.onbeforeunload = function() {
  Meteor.call('kickout', currentRoom().name, User._id)
}