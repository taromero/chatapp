Template.simple_web_rtc.rendered = function() {
  var webrtc = null
  Tracker.autorun(function() {
    if (Session.get('call')) {
      if (User.callConf == 'calling-disabled') {
        alert('You are trying to make a call, but you have calls disabled')
        return;
      }
      var callRoom = Session.get('call').callRoom || 'defaultRoom'
      Caller.answer(callRoom, $('#localVideo'))
    } else {
      Caller.hang($('#localVideo'))
    }
  })

  Calls.find({ $or: [{ from: User._id }, { to: User._id }] }).observe({
    added: function(call) {
      console.log('call', call)
      Session.set('call', call)
    },
    removed: function(call) {
      console.log('call removed')
      Session.set('call', false)
    }
  })
}