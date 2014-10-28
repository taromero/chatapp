Meteor.publish('messages', function() {
  return Messages.find()
})

Meteor.publish('users', function() {
  return Users.find()
})

Meteor.publish('mentions', function() {
  return Mentions.find()
})