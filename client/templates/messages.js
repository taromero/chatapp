Template.messages.helpers({
  messages: function() {
    return Messages.find({}, { sort: { timestamp: -1 } })
  }
})

Template.messages.rendered = function() {
  Tracker.autorun(autocompleteMentions)

  function autocompleteMentions() {
    var users = Users.find({}, { fields: { nick: 1 } }).fetch().map(function(user) {
      // transform 'nick' property to be 'name', to adapt to plug-in format
      return { username: user.nick }
    })
    if (users.length > 0) {
      $('#user_message').mention({
          queryBy: ['name', 'username'],
          emptyQuery: true,
          typeaheadOpts: {
              items: 20 // Max number of items you want to show
          },
          users: users
      });
    }
  }
}

Template.messages.events({
  'keypress #text_entry': function(evt) {
    if (Helpers.isEnter(evt)) {
      var message = {
        author: $('#nick').val() || $('#nick').attr('placeholder'),
        room: currentRoom().name,
        body: $('#text_entry').val(),
        snapshot: Camera.takeSnapshot(),
        timestamp: TimeHelper.serverTimestamp(),
        effect: Session.get('status.class')
      }
      createMention(message)
      Messages.insert(message)
      User.lastMsgTimestamp = TimeHelper.serverTimestamp()
      $('#text_entry').val('')
    }
  }
})

function createMention(message) {
  var regex = /@\w+/g
  var matches = message.body.match(regex)
  if (matches && matches.length > 0) {
    matches.map(function(match) {
      var dest = match.replace('@', '')
      Mentions.insert({
        author: message.author,
        to: dest,
        room: message.room,
        body: message.body,
        snapshot: message.snapshot
      })
    })
  }
}