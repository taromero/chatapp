Template.messages.helpers({
  messages: function() {
    return Messages.find()
  }
})

Template.messages.events({
  'keypress #text_entry': function(evt) {
    if (evt.which === 13) {
      Messages.insert({
        author: 'tomas',
        body: $('#text_entry').val()
      })
    }
  }
})