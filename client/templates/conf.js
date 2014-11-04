Template.conf.events({
  'click .notify-conf': function(evt) {
    Session.set('notificationsLevel', parseInt(evt.currentTarget.dataset.level))
  },

  'click #toogleTitleNotification': function() {
    Session.set('titleNotifications', !Session.get('titleNotifications'))
  },

  'click .msg-notification-conf': function(evt) {
    Session.set('sounds.newMessage', evt.currentTarget.id)
  },
  'click .mention-notification-conf': function(evt) {
    Session.set('sounds.mention', evt.currentTarget.id)
  }
})

Template.conf.helpers({
  titleNotifications: function() {
    return Session.get('titleNotifications')
  },
  messageSoundName: function() {
    return Session.get('sounds.newMessage') || 'default'
  },
  mentionSoundName: function() {
    return Session.get('sounds.mention')
  },
  markNotifLevelActive: function(level) {
    return Session.get('notificationsLevel') == level ? 'active' : ''
  }
})