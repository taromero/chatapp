Template.status.rendered = function() {
  $('.dropdown-button').each(function() {
    $(this).dropdown()
  })
  // display effect when clicking a button (materialize fix, this should work out of the box)
  Waves.displayEffect()
  var confVarNames = ['notificationsLevel', 'sounds.newMessage', 'sounds.mention']
  restoreConfFromLocalStorage()
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

  'click .msg-notification-conf': function(evt) {
    Session.set('sounds.newMessage', evt.currentTarget.id)
  },
  'click .mention-notification-conf': function(evt) {
    Session.set('sounds.mention', evt.currentTarget.id)
  },

  'click #notifyWhenSomeoneBack': function() {
    Session.set('clickSnapshotAction', 'notifyWhenBack')
  },

  'click #createExternalRoomLink': function() {
    sendExternalRoomLink(Meteor.settings.public.external_video_chat_url)

    function sendExternalRoomLink(siteBaseUrl) {
      var externalRoomLink = siteBaseUrl + 'chatappp-meteor_' + Date.now()
      addLinkToMessageInputField(externalRoomLink)
      $('#user_message').focus()

      function addLinkToMessageInputField(externalRoomLink) {
        var $msgInput = $('#user_message')
        if ($msgInput.val()) { // If there is already text, append the link at the end
          $msgInput.val($msgInput.val() + ' ' + externalRoomLink + ' ')
        } else {
          $msgInput.val(externalRoomLink + ' ')
        }
      }
    }
  },
})


Template.status.helpers({
  connected: function() {
    return Meteor.status().connected
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
  notificationsLevel: function() {
    return Session.get('notificationsLevel')
  }
})