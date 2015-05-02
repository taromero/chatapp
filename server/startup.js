Meteor.startup(function() {
  Oauth.configureProviders()
  setInterval(keepMessagesForEachRoomUnder(Meteor.settings.public.max_messages_per_room || 40), 2*1000)

  //TODO: find a more performant way of doing this. Notes:
  //  1. Capped collections don't work as we need to cap based on a query (each room)
  //  2. I couldn't find a way to send skip options to a 'remove' query directly
  function keepMessagesForEachRoomUnder(maxMessagePerRoom) {
    return Meteor.bindEnvironment(function() {
      var rooms = Rooms.find()
      rooms.forEach(function(room) {
        if (Messages.find({ room: room.name }).count() > maxMessagePerRoom) {
          var messages = Messages.find({ room: room.name }, { skip: maxMessagePerRoom, sort: { timestamp: -1 }, fields: { _id: 1 } }).fetch()
          Messages.remove({ _id: { $in: _(messages).pluck('_id') } })
        }
      })
    })
  }
})
