Template.status.rendered = function() {
  Session.setDefault('titleNotifications', false)
  Tracker.autorun(notifyOnConnectionLost())

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
}

Template.status.events({
  'click #normal': setFilter(''),
  'click #call': setFilter('grayscale'),
  'click #dark': setFilter('invert'),
  'click #brb': setFilter('blur'),
  'click #lunch': setFilter('sepia'),

  'click #camClose': function() {
    Session.set('camClose', true)
  },
  'click #camFar': function() {
    Session.set('camClose', false)
  },

  'click #picSmall': function() {
    Session.set('picHeight', 47)
    Session.set('picWidth', 58)
  },
  'click #picMedium': function() {
    Session.set('picHeight', 70)
    Session.set('picWidth', 86)
  },
  'click #picBig': function() {
    Session.set('picHeight', 140)
    Session.set('picWidth', 172)
  },

  'click .notify-conf': function(evt) {
    Notifier.level = parseInt(evt.currentTarget.dataset.level)
  },

  'click #toogleTitleNotification': function() {
    Session.set('titleNotifications', !Session.get('titleNotifications'))
  }
})

Template.status.helpers({
  connected: function() {
    return Meteor.status().connected
  },
  titleNotifications: function() {
    return Session.get('titleNotifications')
  }
})

function setFilter(name) {
  return function() {
    $('video')[0].className = ''
    $('video').addClass(name)
    Session.set('status.class', name)
  }
}