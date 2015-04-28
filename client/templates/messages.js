Template.messages.helpers({
  messages: function() {
    return Messages.find({}, { sort: { timestamp: -1 } })
  }
})

Template.messages.rendered = function() {
  Tracker.autorun(autocompleteMentions)

  function autocompleteMentions() {
    var users = Meteor.users.find({}, { fields: { nick: 1 } }).fetch().map(function(user) {
      // transform 'nick' property to be 'name', to adapt to plug-in format
      return { username: user.nick }
    })

    recreateInput($('#user_message'))

    $('#user_message').mention({
        queryBy: ['name', 'username'],
        emptyQuery: true,
        typeaheadOpts: {
            items: 20 // Max number of items you want to show
        },
        users: users
    });

    function recreateInput($input) {
      // Destroy and create again the input to run mention on it again.
      // `mention` fn doesn't seems to be able to be run multiple times on the same obj
      var inputBk = $input
      var parent = $input.parent()
      $input.remove()
      parent.prepend(inputBk)
      inputBk.on('keypress', function(evt) {
        sendMessageOnEnter(evt)
      })
    }
  }
}

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

function sendMessageOnEnter(evt) {
  if (Helpers.isEnter(evt)) {
    var message = {
      author: $('#nick').val() || $('#nick').attr('placeholder'),
      room: currentRoom().name,
      body: $('#user_message').val(),
      snapshot: Camera.takeSnapshot(),
      timestamp: TimeHelper.serverTimestamp(),
      effect: Session.get('status.class')
    }
    createMention(message)
    Messages.insert(message)
    User.lastMsgTimestamp = TimeHelper.serverTimestamp()
    $('#user_message').val('')
  }
}
