Template.status.rendered = function() {
  Tracker.autorun(notifyOnConnectionLost())

  function notifyOnConnectionLost() {
    var hasConnected = false
    var notified = false
    return function() {
      hasConnected = hasConnected || Meteor.status().connected
      if (hasConnected) {
        // when it connects, why start watching for disconnections
        if (!Meteor.status().connected && !notified) {
          setTimeout(function() {
            if (!Meteor.status().connected) {
              $('#connectionLostModal').modal('show')
              Notifier.notify({
                author: 'App',
                body: 'It seems that you\'ve lost conection with the server'
              })
            }
          }, 5000)
          notified = true
        }
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
  }
})

Template.status.helpers({
  connected: function() {
    return Meteor.status().connected
  }
})

function setFilter(name) {
  return function() {
    $('video')[0].className = ''
    $('video').addClass(name)
    Session.set('status.class', name)
  }
}