Template.status.rendered = function() {
  var confVarNames = ['titleNotifications', 'notificationsLevel', 'sounds.newMessage', 'sounds.mention']
  restoreConfFromLocalStorage()
  Session.setDefault('titleNotifications', false)
  Session.setDefault('callConf', User.callConf)
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
  },

  'click #toggleCall': function() {
    Session.set('clickAndCallMode', !Session.get('clickAndCallMode'))
    if (Session.get('call')) {
      Calls.remove(Session.get('call')._id)
      Session.set('call', null)
    }
  },

  'click #toggleCallAvailability': function() {
    Users.update(User._id, { $set: { callingEnabled: !User.callingEnabled } })
  },

  'click .call-conf': function(evt) {
    var callConf = evt.currentTarget.id
    Session.set('callConf', callConf)
    User.callConf = callConf
    $.jStorage.set('user', User)
    Users.update(User._id, { $set: { callConf: callConf } })
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
    return Session.get('sounds.newMessage') || 'default'
  },
  mentionSoundName: function() {
    return Session.get('sounds.mention')
  },
  markNotifLevelActive: function(level) {
    return Session.get('notificationsLevel') == level ? 'active' : ''
  },
  calling: function() {
    return Session.get('call')
  },
  callConf: function() {
    return Session.get('callConf') || 'video-audio'
  }
})