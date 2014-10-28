Template.messages.rendered = function() {
  Tracker.autorun(showMentions)

  function showMentions() {
    console.log('asdf')
    var user = Session.get('user')
    var mentionsToUser = Mentions.find({ to: user.nick })
    mentionsToUser.forEach(function(msg) {
      showNotification(msg)
    })
    // remove them after they are displayed.
    // Not user Mentions.remove({ to: user.nick }) because a mention can be created in the meanwhile
    mentionsToUser.forEach(function(msg) {
      Mentions.remove(msg._id)
    })
  }
}


Template.messages.helpers({
  messages: function() {
    return Messages.find({}, { sort: { timestamp: -1 } })
  }
})

Template.messages.events({
  'keypress #text_entry': function(evt) {
    if (Helpers.isEnter(evt)) {
      var message = {
        author: $('#nick').val(),
        body: $('#text_entry').val(),
        snapshot: Camera.takeSnapshot(),
        timestamp: new Date().getTime()
      }
      createMention(message)
      Messages.insert(message)
    }
  }
})

function showNotification(msg) {
  var notification = new Notification(msg.from, {
    body: msg.body,
    icon: msg.snapshot
  })
  notification.onclick = function() {
    notification.close()
  }
  setTimeout(function() {
    notification.close()
  }, 5000)
}

function createMention(message) {
  var regex = /@\w+/g
  var matches = message.body.match(regex)
  if (matches && matches.length > 0) {
    matches.map(function(match) {
      var dest = match.replace('@', '')
      Mentions.insert({
        from: message.author,
        to: dest,
        body: message.body,
        snapshot: message.snapshot
      })
    })
  }
}