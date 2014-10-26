Template.messages.helpers({
  messages: function() {
    return Messages.find()
  }
})

Template.messages.events({
  'keypress #text_entry': function(evt) {
    if (Helpers.isEnter(evt)) {
      Messages.insert({
        author: 'tomas',
        body: $('#text_entry').val(),
        snapshot: Camera.takeSnapshot()
      })
    }
  }
})