Template.status.rendered = function() {
  var confVarNames = ['camClose', 'titleNotifications', 'notificationsLevel', 'sounds.newMessage', 'sounds.mention']
  restoreConfFromLocalStorage()
  Session.setDefault('titleNotifications', false)
  Tracker.autorun(notifyOnConnectionLost())
  Tracker.autorun(trackConfToPersist)


  function notifyOnConnectionLost() {
    var hasConnected = false
    var notificationTimeout = null
    var lastConnectedState = null
    return function() {
      var isConnected = Meteor.status().connected
      hasConnected = hasConnected || isConnected
      if (hasConnected) {
        // when it connects, why start watching for disconnections
        if (!isConnected && (lastConnectedState != isConnected)) {
          clearTimeout(notificationTimeout)
          notificationTimeout = setTimeout(function() {
            if (!isConnected) {
              Notifier.notify({
                author: 'App',
                body: 'It seems that you\'ve lost conection with the server'
              })
            }
          }, 1000)
        }
        lastConnectedState = isConnected
      }
    }
  }

  function restoreConfFromLocalStorage() {
    confVarNames.forEach(function(varName) {
      Session.set(varName, $.jStorage.get(varName))
    })
  }

  function trackConfToPersist() {
    confVarNames.forEach(function(varName) {
      var value = Session.get(varName)
      $.jStorage.set(varName, value)
    })
  }
}

Template.status.events({
  'click #camClose': function() {
    Session.set('camClose', true)
  },
  'click #camFar': function() {
    Session.set('camClose', false)
  },

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

Template.status.helpers({
  connected: function() {
    return Meteor.status().connected
  },
  titleNotifications: function() {
    return Session.get('titleNotifications')
  },
  messageSoundName: function() {
    return Session.get('sounds.newMessage')
  },
  mentionSoundName: function() {
    return Session.get('sounds.mention')
  }
})