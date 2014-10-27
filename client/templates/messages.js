Template.messages.helpers({
  messages: function() {
    return Messages.find()
  }
})

Template.messages.events({
  'keypress #text_entry': function(evt) {
    if (Helpers.isEnter(evt)) {
      var message = {
        author: $('#nick').val(),
        body: $('#text_entry').val(),
        snapshot: Camera.takeSnapshot()
      }
      showNotification(message.author, message.body, message.snapshot)
      Messages.insert(message)
    }
  }
})

function showNotification(author, messageBody, icon) {
  var regex = /@\w+/g
  var matches = messageBody.match(regex)
  if (matches && matches.length > 0) {
    matches = matches.map(function(match) {
      match.replace('@', '')
    })
    var notification = new Notification(author, {
      body: messageBody,
      icon: icon
    })
    setTimeout(function() {
      notification.close()
    }, 5000)
  }
}