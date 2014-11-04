Template.status.rendered = function() {
  var confVarNames = ['titleNotifications', 'notificationsLevel', 'high-level-notification-conf', 'sounds.newMessage', 'sounds.mention']
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
  'click #selectCallee': function() {
    Session.set('clickAndCallMode', true)
  },

  'click #hang': function() {
    Caller.hang()
  },

  'click .high-level-notify-conf': function(evt) {
    var level = evt.currentTarget.id
    Session.set('high-level-notification-conf', level)
  }
})

Template.status.helpers({
  connected: function() {
    return Meteor.status().connected
  },
  calling: function() {
    return Session.get('call')
  },
  markHighNotifLevelActive: function(level) {
    return Session.get('high-level-notification-conf') == level ? 'active' : ''
  }
})