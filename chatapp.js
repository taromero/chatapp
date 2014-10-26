Messages = new Meteor.Collection('messages')

if (Meteor.isClient) {
  Meteor.subscribe('messages')

  Template.app.helpers({
    messages: function() {
      return Messages.find()
    }
  })

  Template.app.events({
    'keypress #text_entry': function(evt) {
      if (evt.which === 13) {
        Messages.insert({
          author: 'tomas',
          body: $('#text_entry').val()
        })
      }
    }
  })
}

if (Meteor.isServer) {
  Meteor.publish("messages", function() {
    return Messages.find()
  })
}
