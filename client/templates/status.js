Template.status.rendered = function() {
  var confVarNames = ['titleNotifications', 'notificationsLevel', 'sounds.newMessage', 'sounds.mention']
  restoreConfFromLocalStorage()
  Session.setDefault('titleNotifications', false)
  Tracker.autorun(trackConfToPersist)

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

  'click #selectCallee': function() {
    Session.set('clickSnapshotAction', 'call')
  },

  'click #notifyWhenSomeoneBack': function() {
    Session.set('clickSnapshotAction', 'notifyWhenBack')
  },

  'click #hang': function() {
    Caller.hang()
  },

  'click #toggleCallAvailability': function() {
    Users.update(User._id, { $set: { callingEnabled: !User.callingEnabled } })
  },

  'click #createTalkyRoomLink': function() {
    sendExternalRoomLink('https://talky.io/')
  },
  'click #createAppearInRoomLink': function() {
    sendExternalRoomLink('https://appear.in/')
  }
})

function sendExternalRoomLink(siteBaseUrl) {
  var externalRoomLink = siteBaseUrl + 'chatappp-meteor_' + Date.now()
  addLinkToMessageInputField(externalRoomLink)

  function addLinkToMessageInputField(talkyLink) {
    var $msgInput = $('#user_message')
    if ($msgInput.val()) { // If there is already text, append the link at the end
      $msgInput.val($msgInput.val() + ' ' + talkyLink)
    } else {
      $msgInput.val(talkyLink)
    }
  }
}

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
  }
})